export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id ?? null;
    const body = await request.json();

    const quote = await prisma.quote.create({
      data: {
        userId,
        name: body?.name ?? '',
        email: body?.email ?? '',
        phone: body?.phone ?? null,
        company: body?.company ?? null,
        description: body?.description ?? '',
        quantity: body?.quantity ? parseInt(body.quantity) : null,
        productType: body?.productType ?? null,
        designCloudPath: body?.designCloudPath ?? null,
        designIsPublic: body?.designIsPublic ?? false,
      },
    });
    return NextResponse.json({ success: true, id: quote?.id });
  } catch (error: any) {
    console.error('Quote error:', error);
    return NextResponse.json({ error: 'Failed to submit quote' }, { status: 500 });
  }
}
