export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cleanText } from '@/lib/request-guard';

/**
 * Kalon shportën e vizitorit te llogaria, sapo ai hyn. Produktet verifikohen
 * te databaza; çdo rresht që nuk gjendet, thjesht anashkalohet.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as any)?.id;

    const body = await request.json();
    const rawItems: any[] = Array.isArray(body?.items) ? body.items.slice(0, 50) : [];
    if (!rawItems.length) return NextResponse.json({ merged: 0 });

    const ids = Array.from(new Set(rawItems.map((item) => String(item?.productId ?? '')).filter(Boolean)));
    const products = await prisma.product.findMany({ where: { id: { in: ids }, isActive: true }, select: { id: true, minQuantity: true } });
    const byId = new Map(products.map((product) => [product.id, product]));

    const data = rawItems
      .map((item) => {
        const product = byId.get(String(item?.productId ?? ''));
        if (!product) return null;
        return {
          userId,
          productId: product.id,
          quantity: Math.max(product.minQuantity ?? 1, Math.min(parseInt(String(item?.quantity ?? 1), 10) || 1, 100000)),
          size: cleanText(item?.size, 20) || null,
          color: cleanText(item?.color, 40) || null,
          printArea: cleanText(item?.printArea, 60) || null,
          designCloudPath: cleanText(item?.designCloudPath, 500) || null,
          designIsPublic: Boolean(item?.designIsPublic),
          notes: cleanText(item?.notes, 500) || null,
        };
      })
      .filter(Boolean) as any[];

    if (!data.length) return NextResponse.json({ merged: 0 });

    await prisma.cartItem.createMany({ data });
    return NextResponse.json({ merged: data.length });
  } catch (error: any) {
    console.error('Cart merge error:', error);
    return NextResponse.json({ error: 'Failed to merge cart' }, { status: 500 });
  }
}
