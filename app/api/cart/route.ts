export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ items: [] });
    const userId = (session.user as any)?.id;
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ items: items ?? [] });
  } catch (error: any) {
    console.error('Cart error:', error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as any)?.id;
    const body = await request.json();

    const item = await prisma.cartItem.create({
      data: {
        userId,
        productId: body?.productId ?? '',
        quantity: body?.quantity ?? 1,
        size: body?.size ?? null,
        color: body?.color ?? null,
        printArea: body?.printArea ?? null,
        designCloudPath: body?.designCloudPath ?? null,
        designIsPublic: body?.designIsPublic ?? false,
        notes: body?.notes ?? null,
      },
    });
    return NextResponse.json({ item });
  } catch (error: any) {
    console.error('Cart add error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}
