export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ items: items ?? [] });
  } catch (error: any) {
    console.error('Portfolio error:', error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
