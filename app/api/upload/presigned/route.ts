export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { generatePresignedUploadUrl } from '@/lib/storage';

const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES ?? 25 * 1024 * 1024);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, contentType, isPublic, fileSize } = body ?? {};
    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'fileName and contentType required' }, { status: 400 });
    }
    if (typeof fileSize === 'number' && fileSize > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }
    const origin = new URL(request.url).origin;
    const result = await generatePresignedUploadUrl(fileName, contentType, isPublic ?? false, origin);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Upload presigned error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
