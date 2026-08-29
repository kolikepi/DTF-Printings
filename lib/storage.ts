/**
 * Storage për skedarët e ngarkuar (dizajnet e klientëve).
 *
 * Dy drivera, të zgjedhur me STORAGE_DRIVER:
 *   - "local" (default): disku i serverit, pa asnjë llogari cloud.
 *   - "s3": çdo storage S3-compatible (AWS S3, Cloudflare R2, MinIO, Backblaze B2...).
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export type StorageDriver = 'local' | 's3';

export function getStorageDriver(): StorageDriver {
  return process.env.STORAGE_DRIVER === 's3' ? 's3' : 'local';
}

/**
 * Në hosting serverless (Vercel) disku fshihet pas çdo kërkese, ndaj driver-i lokal
 * i humb dizajnet. Shkaktohet gabim i qartë në vend që skedari të zhduket në heshtje.
 */
function assertDriverUsable() {
  if (getStorageDriver() === 'local' && process.env.VERCEL) {
    throw new Error(
      'STORAGE_DRIVER=local nuk funksionon në Vercel — disku nuk ruhet. Vendos STORAGE_DRIVER=s3 (S3, R2, MinIO, B2).',
    );
  }
}

function getUploadDir() {
  return path.resolve(process.env.UPLOAD_DIR ?? './storage');
}

function getSigningSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET mungon — nevojitet për të nënshkruar upload-et lokale.');
  return secret;
}

/** Emër skedari i sigurt: pa shtigje, pa karaktere të çuditshme. */
function sanitizeFileName(fileName: string) {
  const base = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
  return base.slice(-120) || 'file';
}

function buildObjectPath(fileName: string, isPublic: boolean) {
  const prefix = isPublic ? 'public/uploads' : 'uploads';
  return `${prefix}/${Date.now()}-${sanitizeFileName(fileName)}`;
}

/** Refuzon shtigje që dalin jashtë dosjes së upload-eve. */
export function resolveLocalPath(cloudStoragePath: string) {
  const root = getUploadDir();
  const full = path.resolve(root, cloudStoragePath);
  if (full !== root && !full.startsWith(root + path.sep)) {
    throw new Error('Shteg i palejuar.');
  }
  return full;
}

export function signLocalUpload(cloudStoragePath: string, expiresAt: number) {
  return crypto
    .createHmac('sha256', getSigningSecret())
    .update(`${cloudStoragePath}:${expiresAt}`)
    .digest('hex');
}

export function verifyLocalUpload(cloudStoragePath: string, expiresAt: number, token: string) {
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = signLocalUpload(cloudStoragePath, expiresAt);
  const a = Buffer.from(expected);
  const b = Buffer.from(token ?? '');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// --- S3 (i ngarkuar vetëm kur driver-i është "s3") -------------------------

async function s3Client() {
  const { S3Client } = await import('@aws-sdk/client-s3');
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  return new S3Client({
    region: process.env.AWS_REGION ?? 'us-east-1',
    // Endpoint-i i personalizuar lejon R2 / MinIO / B2 në vend të AWS-it.
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
  });
}

function bucketName() {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) throw new Error('AWS_S3_BUCKET mungon — nevojitet kur STORAGE_DRIVER=s3.');
  return bucket;
}

// --- API publike -----------------------------------------------------------

/**
 * Kthen një URL ku klienti e dërgon skedarin me PUT, plus shtegun që ruhet në DB.
 * `origin` përdoret vetëm nga driver-i lokal (p.sh. https://elev8.al).
 */
export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string,
  isPublic = false,
  origin = '',
) {
  assertDriverUsable();
  const cloud_storage_path = buildObjectPath(fileName, isPublic);

  if (getStorageDriver() === 'local') {
    const expiresAt = Date.now() + 60 * 60 * 1000;
    const token = signLocalUpload(cloud_storage_path, expiresAt);
    const params = new URLSearchParams({ path: cloud_storage_path, expires: String(expiresAt), token });
    return { uploadUrl: `${origin}/api/upload/local?${params.toString()}`, cloud_storage_path };
  }

  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const command = new PutObjectCommand({
    Bucket: bucketName(),
    Key: cloud_storage_path,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(await s3Client(), command, { expiresIn: 3600 });
  return { uploadUrl, cloud_storage_path };
}

/** Ruan një skedar në disk (driver lokal). */
export async function writeLocalFile(cloudStoragePath: string, data: Buffer) {
  const full = resolveLocalPath(cloudStoragePath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, data);
  return full;
}

/** Lexon një skedar nga disku (driver lokal). */
export async function readLocalFile(cloudStoragePath: string) {
  return fs.readFile(resolveLocalPath(cloudStoragePath));
}

/** URL e përkohshme për shkarkim — vetëm për driver-in s3. */
export async function getSignedDownloadUrl(cloudStoragePath: string) {
  const { GetObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const command = new GetObjectCommand({
    Bucket: bucketName(),
    Key: cloudStoragePath,
    ResponseContentDisposition: 'attachment',
  });
  return getSignedUrl(await s3Client(), command, { expiresIn: 3600 });
}

export async function deleteFile(cloudStoragePath: string) {
  if (getStorageDriver() === 'local') {
    await fs.rm(resolveLocalPath(cloudStoragePath), { force: true });
    return;
  }
  const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
  const client = await s3Client();
  await client.send(new DeleteObjectCommand({ Bucket: bucketName(), Key: cloudStoragePath }));
}
