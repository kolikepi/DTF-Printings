export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/email';
import { orderStatusEmail } from '@/lib/email-templates';

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

const ORDER_STATUSES = ['pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'];

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const id = typeof body?.id === 'string' ? body.id : '';
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const data: Record<string, any> = {};
    if (typeof body?.status === 'string') {
      if (!ORDER_STATUSES.includes(body.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      data.status = body.status;
    }
    if (typeof body?.paymentStatus === 'string') {
      data.paymentStatus = ['pending', 'paid'].includes(body.paymentStatus) ? body.paymentStatus : 'pending';
    }
    if (typeof body?.adminNote === 'string') data.adminNote = body.adminNote.slice(0, 2000);
    if (!Object.keys(data).length) return NextResponse.json({ error: 'nothing to update' }, { status: 400 });

    const order = await prisma.order.update({
      where: { id },
      data,
      include: { items: { include: { product: true } }, user: true },
    });

    // Klienti njoftohet vetëm kur ndryshon statusi, jo kur shkruhet një shënim i brendshëm.
    const recipient = order.customerEmail ?? order.user?.email ?? '';
    if (data.status && recipient) {
      const mail = orderStatusEmail(order, 'sq');
      await sendMail({ to: recipient, subject: mail.subject, html: mail.html });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Admin order update error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
