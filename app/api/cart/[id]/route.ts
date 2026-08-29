export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as any)?.id;

    await prisma.cartItem.deleteMany({
      where: { id: params?.id ?? '', userId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cart delete error:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as any)?.id;
    const body = await request.json();

    const item = await prisma.cartItem.updateMany({
      where: { id: params?.id ?? '', userId },
      data: { quantity: body?.quantity ?? 1 },
    });
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error('Cart update error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
