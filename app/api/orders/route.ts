export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as any)?.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ orders: orders ?? [] });
  } catch (error: any) {
    console.error('Orders error:', error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as any)?.id;
    const body = await request.json();

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!cartItems?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = (cartItems ?? []).reduce((sum: number, item: any) => {
      return sum + ((item?.product?.basePrice ?? 0) * (item?.quantity ?? 1));
    }, 0);

    const shippingCost = subtotal >= 5000 ? 0 : 300;
    const total = subtotal + shippingCost;
    const orderNumber = `E8-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        shippingCost,
        total,
        shippingName: body?.shippingName ?? '',
        shippingAddress: body?.shippingAddress ?? '',
        shippingCity: body?.shippingCity ?? '',
        shippingPhone: body?.shippingPhone ?? '',
        shippingNotes: body?.shippingNotes ?? '',
        paymentMethod: body?.paymentMethod ?? 'cash',
        items: {
          create: (cartItems ?? []).map((item: any) => ({
            productId: item?.productId ?? '',
            quantity: item?.quantity ?? 1,
            unitPrice: item?.product?.basePrice ?? 0,
            totalPrice: (item?.product?.basePrice ?? 0) * (item?.quantity ?? 1),
            size: item?.size ?? null,
            color: item?.color ?? null,
            printArea: item?.printArea ?? null,
            designCloudPath: item?.designCloudPath ?? null,
            designIsPublic: item?.designIsPublic ?? false,
            notes: item?.notes ?? null,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    await prisma.cartItem.deleteMany({ where: { userId } });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
