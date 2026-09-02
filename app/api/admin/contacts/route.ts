export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    return NextResponse.json({ contacts: contacts ?? [] });
  } catch (error: any) {
    console.error('Admin contacts error:', error);
    return NextResponse.json({ contacts: [] }, { status: 500 });
  }
}

const STATUSES = ['new', 'in_progress', 'answered', 'closed'];

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const id = typeof body?.id === 'string' ? body.id : '';
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const data: Record<string, any> = {};
    if (typeof body?.status === 'string') {
      if (!STATUSES.includes(body.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      data.status = body.status;
    }
    if (typeof body?.adminNote === 'string') data.adminNote = body.adminNote.slice(0, 2000);
    if (!Object.keys(data).length) return NextResponse.json({ error: 'nothing to update' }, { status: 400 });

    const record = await prisma.contact.update({ where: { id }, data });
    return NextResponse.json({ contact: record });
  } catch (error: any) {
    console.error('Admin update error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
