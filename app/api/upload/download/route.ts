export const dynamic = 'force-dynamic';

import path from 'path';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSignedDownloadUrl, getStorageDriver, readLocalFile } from '@/lib/storage';

/** Shkarkon një dizajn të ngarkuar. Vetëm admin — dizajnet janë private. */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const cloudStoragePath = new URL(request.url).searchParams.get('path') ?? '';
    if (!cloudStoragePath) return NextResponse.json({ error: 'path required' }, { status: 400 });

    if (getStorageDriver() === 's3') {
      return NextResponse.redirect(await getSignedDownloadUrl(cloudStoragePath));
    }

    const data = await readLocalFile(cloudStoragePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${path.basename(cloudStoragePath)}"`,
      },
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 404 });
  }
}
