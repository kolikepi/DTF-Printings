export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { lineTotal, shippingFor, unitPriceFor } from '@/lib/pricing';
import { adminAddress, sendMail } from '@/lib/email';
import { orderAdminEmail, orderCustomerEmail } from '@/lib/email-templates';
import { allowRequest, cleanText, clientIp, invalid, isBot, isEmail, isPhone, tooManyRequests } from '@/lib/request-guard';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as any)?.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ orders: orders ?? [] });
  } catch (error: any) {
    console.error('Orders error:', error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}

type PreparedItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size: string | null;
  color: string | null;
  printArea: string | null;
  designCloudPath: string | null;
  designIsPublic: boolean;
  notes: string | null;
};

/**
 * Çmimet merren gjithmonë nga databaza, kurrë nga kërkesa e klientit — edhe kur
 * artikujt vijnë nga shporta e një vizitori pa llogari.
 */
async function prepareItems(rawItems: any[]): Promise<PreparedItem[]> {
  const ids = Array.from(new Set((rawItems ?? []).map((item: any) => String(item?.productId ?? '')).filter(Boolean)));
  if (!ids.length) return [];

  const products = await prisma.product.findMany({ where: { id: { in: ids }, isActive: true } });
  const byId = new Map(products.map((product) => [product.id, product]));

  return (rawItems ?? [])
    .map((item: any) => {
      const product = byId.get(String(item?.productId ?? ''));
      if (!product) return null;
      const quantity = Math.max(product.minQuantity ?? 1, Math.min(parseInt(String(item?.quantity ?? 1), 10) || 1, 100000));
      return {
        productId: product.id,
        quantity,
        unitPrice: unitPriceFor(product.basePrice, quantity),
        totalPrice: lineTotal(product.basePrice, quantity),
        size: cleanText(item?.size, 20) || null,
        color: cleanText(item?.color, 40) || null,
        printArea: cleanText(item?.printArea, 60) || null,
        designCloudPath: cleanText(item?.designCloudPath, 500) || null,
        designIsPublic: Boolean(item?.designIsPublic),
        notes: cleanText(item?.notes, 500) || null,
      } as PreparedItem;
    })
    .filter(Boolean) as PreparedItem[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lang = body?.lang === 'en' ? 'en' : 'sq';

    if (isBot(body)) return NextResponse.json({ success: true });
    if (!allowRequest(`order:${clientIp(request)}`, 10, 10 * 60 * 1000)) return tooManyRequests(lang);

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id ?? null;

    const shippingName = cleanText(body?.shippingName, 120);
    const shippingAddress = cleanText(body?.shippingAddress, 300);
    const shippingCity = cleanText(body?.shippingCity, 120);
    const shippingPhone = cleanText(body?.shippingPhone, 40);
    const customerEmail = cleanText(body?.customerEmail ?? (session?.user as any)?.email, 254).toLowerCase();

    const errors: Record<string, string> = {};
    if (shippingName.length < 2) errors.shippingName = lang === 'sq' ? 'Shkruani emrin.' : 'Enter your name.';
    if (shippingAddress.length < 4) errors.shippingAddress = lang === 'sq' ? 'Shkruani adresën.' : 'Enter your address.';
    if (shippingCity.length < 2) errors.shippingCity = lang === 'sq' ? 'Shkruani qytetin.' : 'Enter your city.';
    if (!isPhone(shippingPhone)) errors.shippingPhone = lang === 'sq' ? 'Shkruani një numër telefoni të saktë.' : 'Enter a valid phone number.';
    if (!isEmail(customerEmail)) errors.customerEmail = lang === 'sq' ? 'Shkruani një email ku t’ju kontaktojmë.' : 'Enter an email we can reach you at.';
    if (Object.keys(errors).length) return invalid(errors, lang);

    // Klienti me llogari ka shportën te databaza; vizitori i dërgon artikujt vetë.
    const rawItems = userId
      ? (await prisma.cartItem.findMany({ where: { userId } })).map((item) => ({ ...item }))
      : body?.items;

    const items = await prepareItems(rawItems ?? []);
    if (!items.length) {
      return NextResponse.json({ error: lang === 'sq' ? 'Shporta është bosh.' : 'Cart is empty' }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingCost = shippingFor(subtotal);
    const total = subtotal + shippingCost;
    const orderNumber = `E8-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerEmail,
        subtotal,
        shippingCost,
        total,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingPhone,
        shippingNotes: cleanText(body?.shippingNotes, 1000) || null,
        paymentMethod: body?.paymentMethod === 'bank' ? 'bank' : 'cash',
        items: { create: items },
      },
      include: { items: { include: { product: true } }, user: true },
    });

    if (userId) await prisma.cartItem.deleteMany({ where: { userId } });

    const admin = orderAdminEmail(order, 'sq');
    const customer = orderCustomerEmail(order, lang);
    await Promise.all([
      sendMail({ to: adminAddress(), subject: admin.subject, html: admin.html, replyTo: customerEmail }),
      sendMail({ to: customerEmail, subject: customer.subject, html: customer.html }),
    ]);

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
