export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ testimonials: testimonials ?? [] });
  } catch (error: any) {
    console.error('Testimonials error:', error);
    return NextResponse.json({ testimonials: [] }, { status: 500 });
  }
}
