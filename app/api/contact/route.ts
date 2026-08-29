export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contact = await prisma.contact.create({
      data: {
        name: body?.name ?? '',
        email: body?.email ?? '',
        phone: body?.phone ?? null,
        subject: body?.subject ?? null,
        message: body?.message ?? '',
      },
    });
    return NextResponse.json({ success: true, id: contact?.id });
  } catch (error: any) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
