export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAddress, sendMail } from '@/lib/email';
import { contactAdminEmail, contactCustomerEmail } from '@/lib/email-templates';
import { allowRequest, cleanText, clientIp, invalid, isBot, isEmail, isPhone, tooManyRequests } from '@/lib/request-guard';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lang = body?.lang === 'en' ? 'en' : 'sq';

    if (isBot(body)) return NextResponse.json({ success: true });
    if (!allowRequest(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000)) return tooManyRequests(lang);

    const name = cleanText(body?.name, 120);
    const email = cleanText(body?.email, 254);
    const message = cleanText(body?.message, 4000);
    const phone = cleanText(body?.phone, 40);

    const errors: Record<string, string> = {};
    if (name.length < 2) errors.name = lang === 'sq' ? 'Shkruani emrin.' : 'Enter your name.';
    if (!isEmail(email)) errors.email = lang === 'sq' ? 'Email-i nuk është i vlefshëm.' : 'Invalid email address.';
    if (message.length < 5) errors.message = lang === 'sq' ? 'Shkruani mesazhin.' : 'Write your message.';
    if (phone && !isPhone(phone)) errors.phone = lang === 'sq' ? 'Numri i telefonit nuk duket i saktë.' : 'That phone number looks wrong.';
    if (Object.keys(errors).length) return invalid(errors, lang);

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: cleanText(body?.subject, 200) || null,
        message,
      },
    });

    const admin = contactAdminEmail(contact, 'sq');
    const customer = contactCustomerEmail(contact, lang);
    await Promise.all([
      sendMail({ to: adminAddress(), subject: admin.subject, html: admin.html, replyTo: contact.email }),
      sendMail({ to: contact.email, subject: customer.subject, html: customer.html }),
    ]);

    return NextResponse.json({ success: true, id: contact?.id });
  } catch (error: any) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
