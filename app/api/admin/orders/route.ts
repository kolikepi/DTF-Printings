export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ orders: orders ?? [] });
  } catch (error: any) {
    console.error('Admin orders error:', error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
