export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await prisma.newsletter.upsert({
      where: { email: body.email },
      update: {},
      create: { email: body.email },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
