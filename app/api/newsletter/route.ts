export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { allowRequest, cleanText, clientIp, invalid, isBot, isEmail, tooManyRequests } from '@/lib/request-guard';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lang = body?.lang === 'en' ? 'en' : 'sq';

    if (isBot(body)) return NextResponse.json({ success: true });
    if (!allowRequest(`newsletter:${clientIp(request)}`, 5, 10 * 60 * 1000)) return tooManyRequests(lang);

    const email = cleanText(body?.email, 254).toLowerCase();
    if (!isEmail(email)) {
      return invalid({ email: lang === 'sq' ? 'Email-i nuk është i vlefshëm.' : 'Invalid email address.' }, lang);
    }

    await prisma.newsletter.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
