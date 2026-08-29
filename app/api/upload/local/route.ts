export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verifyLocalUpload, writeLocalFile } from '@/lib/storage';

const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES ?? 25 * 1024 * 1024);

/** Pranon skedarin që klienti dërgon te URL-ja e nënshkruar nga /api/upload/presigned. */
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const cloudStoragePath = url.searchParams.get('path') ?? '';
    const expires = Number(url.searchParams.get('expires'));
    const token = url.searchParams.get('token') ?? '';

    if (!cloudStoragePath || !verifyLocalUpload(cloudStoragePath, expires, token)) {
      return NextResponse.json({ error: 'Invalid or expired upload URL' }, { status: 403 });
    }

    const data = Buffer.from(await request.arrayBuffer());
    if (data.byteLength > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    await writeLocalFile(cloudStoragePath, data);
    return NextResponse.json({ ok: true, cloud_storage_path: cloudStoragePath });
  } catch (error: any) {
    console.error('Local upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
