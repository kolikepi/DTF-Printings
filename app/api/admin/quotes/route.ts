export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const quotes = await prisma.quote.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    return NextResponse.json({ quotes: quotes ?? [] });
  } catch (error: any) {
    console.error('Admin quotes error:', error);
    return NextResponse.json({ quotes: [] }, { status: 500 });
  }
}
