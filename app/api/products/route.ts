export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams?.get('category') ?? undefined;
    const featured = searchParams?.get('featured');

    const where: any = { isActive: true };
    if (category) where.category = { slug: category };
    if (featured === 'true') where.isFeatured = true;

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products: products ?? [] });
  } catch (error: any) {
    console.error('Products error:', error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
