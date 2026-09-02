export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { adminAddress, sendMail } from '@/lib/email';
import { quoteAdminEmail, quoteCustomerEmail } from '@/lib/email-templates';
import { allowRequest, cleanText, clientIp, invalid, isBot, isEmail, isPhone, tooManyRequests } from '@/lib/request-guard';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lang = body?.lang === 'en' ? 'en' : 'sq';

    if (isBot(body)) return NextResponse.json({ success: true });
    if (!allowRequest(`quote:${clientIp(request)}`, 5, 10 * 60 * 1000)) return tooManyRequests(lang);

    const name = cleanText(body?.name, 120);
    const email = cleanText(body?.email, 254);
    const description = cleanText(body?.description, 4000);
    const phone = cleanText(body?.phone, 40);

    const errors: Record<string, string> = {};
    if (name.length < 2) errors.name = lang === 'sq' ? 'Shkruani emrin.' : 'Enter your name.';
    if (!isEmail(email)) errors.email = lang === 'sq' ? 'Email-i nuk është i vlefshëm.' : 'Invalid email address.';
    if (description.length < 5) errors.description = lang === 'sq' ? 'Përshkruani çfarë ju duhet.' : 'Describe what you need.';
    if (phone && !isPhone(phone)) errors.phone = lang === 'sq' ? 'Numri i telefonit nuk duket i saktë.' : 'That phone number looks wrong.';
    if (Object.keys(errors).length) return invalid(errors, lang);

    const session = await getServerSession(authOptions);
    const quantityRaw = parseInt(String(body?.quantity ?? ''), 10);

    const quote = await prisma.quote.create({
      data: {
        userId: (session?.user as any)?.id ?? null,
        name,
        email,
        phone: phone || null,
        company: cleanText(body?.company, 160) || null,
        description,
        quantity: Number.isFinite(quantityRaw) && quantityRaw > 0 ? Math.min(quantityRaw, 1000000) : null,
        productType: cleanText(body?.productType, 120) || null,
        designCloudPath: cleanText(body?.designCloudPath, 500) || null,
        designIsPublic: body?.designIsPublic ?? false,
      },
    });

    const admin = quoteAdminEmail(quote, 'sq');
    const customer = quoteCustomerEmail(quote, lang);
    await Promise.all([
      sendMail({ to: adminAddress(), subject: admin.subject, html: admin.html, replyTo: quote.email }),
      sendMail({ to: quote.email, subject: customer.subject, html: customer.html }),
    ]);

    return NextResponse.json({ success: true, id: quote?.id });
  } catch (error: any) {
    console.error('Quote error:', error);
    return NextResponse.json({ error: 'Failed to submit quote' }, { status: 500 });
  }
}
