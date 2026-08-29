export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ categories: categories ?? [] });
  } catch (error: any) {
    console.error('Categories error:', error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
