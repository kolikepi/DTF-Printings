export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { allowRequest, cleanText, clientIp, invalid, isBot, isEmail, tooManyRequests } from '@/lib/request-guard';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lang = body?.lang === 'en' ? 'en' : 'sq';

    if (isBot(body)) return NextResponse.json({ success: true });
    if (!allowRequest(`signup:${clientIp(request)}`, 10, 60 * 60 * 1000)) return tooManyRequests(lang);

    const email = cleanText(body?.email, 254).toLowerCase();
    const password = typeof body?.password === 'string' ? body.password : '';
    const name = cleanText(body?.name, 120);

    const errors: Record<string, string> = {};
    if (!isEmail(email)) errors.email = lang === 'sq' ? 'Email-i nuk është i vlefshëm.' : 'Invalid email address.';
    if (password.length < 8) {
      errors.password = lang === 'sq' ? 'Fjalëkalimi duhet të ketë të paktën 8 karaktere.' : 'Password must be at least 8 characters.';
    }
    if (Object.keys(errors).length) return invalid(errors, lang);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: lang === 'sq' ? 'Ky email është i regjistruar tashmë.' : 'Email already registered' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    return NextResponse.json({ id: user?.id, email: user?.email, name: user?.name });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
