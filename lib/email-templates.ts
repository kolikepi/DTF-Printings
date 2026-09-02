import type { Lang } from '@/lib/translations';
import { formatPrice } from '@/lib/pricing';

/** Përmbajtja e email-eve. HTML i thjeshtë me tabela — hapet saktë edhe te Outlook-u. */

const BRAND = 'Elev8 Printings';
const ACCENT = '#2563EB';

function siteUrl() {
  return process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
}

function escape(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function layout(title: string, bodyHtml: string, footerNote: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#14161a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e4e6eb;">
    <tr><td style="padding:20px 24px;border-bottom:1px solid #e4e6eb;">
      <span style="font-size:18px;font-weight:700;color:${ACCENT};">Elev8</span>
      <span style="font-size:18px;font-weight:700;"> Printings</span>
    </td></tr>
    <tr><td style="padding:24px;">
      <h1 style="margin:0 0 16px;font-size:19px;line-height:1.3;">${escape(title)}</h1>
      ${bodyHtml}
    </td></tr>
    <tr><td style="padding:16px 24px;border-top:1px solid #e4e6eb;font-size:12px;color:#5c6270;">
      ${escape(footerNote)}
    </td></tr>
  </table>
</body></html>`;
}

function rows(pairs: [string, unknown][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
    ${pairs
      .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#5c6270;white-space:nowrap;vertical-align:top;">${escape(label)}</td><td style="padding:6px 0;">${escape(value)}</td></tr>`,
      )
      .join('')}
  </table>`;
}

function button(href: string, label: string) {
  return `<p style="margin:22px 0 0;"><a href="${escape(href)}" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:8px;font-size:14px;font-weight:600;">${escape(label)}</a></p>`;
}

// ---------- kërkesë oferte ----------

export function quoteAdminEmail(quote: any, lang: Lang = 'sq') {
  const sq = lang === 'sq';
  const body =
    rows([
      [sq ? 'Emri' : 'Name', quote?.name],
      ['Email', quote?.email],
      [sq ? 'Telefoni' : 'Phone', quote?.phone],
      [sq ? 'Kompania' : 'Company', quote?.company],
      [sq ? 'Produkti' : 'Product', quote?.productType],
      [sq ? 'Sasia' : 'Quantity', quote?.quantity],
    ]) +
    `<p style="margin:18px 0 0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escape(quote?.description)}</p>` +
    (quote?.designCloudPath
      ? `<p style="margin:14px 0 0;font-size:14px;">${sq ? 'Dizajni i bashkangjitur' : 'Design attached'}: <a href="${siteUrl()}/api/upload/download?path=${encodeURIComponent(quote.designCloudPath)}">${sq ? 'shkarko' : 'download'}</a></p>`
      : '') +
    button(`${siteUrl()}/admin`, sq ? 'Hap panelin' : 'Open admin panel');

  return {
    subject: sq
      ? `Kërkesë e re oferte — ${quote?.name ?? ''}`
      : `New quote request — ${quote?.name ?? ''}`,
    html: layout(sq ? 'Kërkesë e re oferte' : 'New quote request', body, sq ? `Dërguar nga ${BRAND}` : `Sent by ${BRAND}`),
  };
}

export function quoteCustomerEmail(quote: any, lang: Lang = 'sq') {
  const sq = lang === 'sq';
  const body = sq
    ? `<p style="margin:0;font-size:15px;line-height:1.7;">Përshëndetje ${escape(quote?.name)},</p>
       <p style="margin:14px 0 0;font-size:15px;line-height:1.7;">E morëm kërkesën tuaj për ofertë dhe po e shqyrtojmë. Ju përgjigjemi brenda <strong>24 orësh pune</strong>.</p>
       <p style="margin:14px 0 0;font-size:15px;line-height:1.7;">Nëse çështja është urgjente, na shkruani në WhatsApp te numri +355 69 205 5861.</p>`
    : `<p style="margin:0;font-size:15px;line-height:1.7;">Hello ${escape(quote?.name)},</p>
       <p style="margin:14px 0 0;font-size:15px;line-height:1.7;">We received your quote request and are reviewing it. You will hear from us within <strong>24 business hours</strong>.</p>
       <p style="margin:14px 0 0;font-size:15px;line-height:1.7;">If it is urgent, message us on WhatsApp at +355 69 205 5861.</p>`;

  return {
    subject: sq ? 'E morëm kërkesën tuaj — Elev8 Printings' : 'We received your request — Elev8 Printings',
    html: layout(
      sq ? 'Faleminderit për kërkesën' : 'Thank you for your request',
      body + rows([[sq ? 'Produkti' : 'Product', quote?.productType], [sq ? 'Sasia' : 'Quantity', quote?.quantity]]),
      sq ? 'Ky email u dërgua automatikisht. Mund t’i përgjigjeni direkt.' : 'This email was sent automatically. You can reply directly.',
    ),
  };
}

// ---------- mesazh kontakti ----------

export function contactAdminEmail(contact: any, lang: Lang = 'sq') {
  const sq = lang === 'sq';
  const body =
    rows([
      [sq ? 'Emri' : 'Name', contact?.name],
      ['Email', contact?.email],
      [sq ? 'Telefoni' : 'Phone', contact?.phone],
      [sq ? 'Subjekti' : 'Subject', contact?.subject],
    ]) +
    `<p style="margin:18px 0 0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escape(contact?.message)}</p>` +
    button(`${siteUrl()}/admin`, sq ? 'Hap panelin' : 'Open admin panel');

  return {
    subject: sq ? `Mesazh i ri — ${contact?.name ?? ''}` : `New message — ${contact?.name ?? ''}`,
    html: layout(sq ? 'Mesazh i ri nga faqja' : 'New message from the website', body, sq ? `Dërguar nga ${BRAND}` : `Sent by ${BRAND}`),
  };
}

export function contactCustomerEmail(contact: any, lang: Lang = 'sq') {
  const sq = lang === 'sq';
  const body = sq
    ? `<p style="margin:0;font-size:15px;line-height:1.7;">Përshëndetje ${escape(contact?.name)},</p>
       <p style="margin:14px 0 0;font-size:15px;line-height:1.7;">Mesazhi juaj mbërriti te ne. Ju përgjigjemi brenda një dite pune.</p>`
    : `<p style="margin:0;font-size:15px;line-height:1.7;">Hello ${escape(contact?.name)},</p>
       <p style="margin:14px 0 0;font-size:15px;line-height:1.7;">Your message reached us. We will reply within one business day.</p>`;

  return {
    subject: sq ? 'E morëm mesazhin tuaj — Elev8 Printings' : 'We received your message — Elev8 Printings',
    html: layout(sq ? 'Faleminderit që na shkruat' : 'Thanks for writing', body, sq ? 'Mund t’i përgjigjeni direkt këtij email-i.' : 'You can reply directly to this email.'),
  };
}

// ---------- porosi ----------

function orderItemsTable(order: any, lang: Lang) {
  const sq = lang === 'sq';
  const items = (order?.items ?? [])
    .map(
      (item: any) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eef0f3;font-size:14px;">
          ${escape(sq ? (item?.product?.nameAl ?? item?.product?.name) : item?.product?.name)}
          <span style="color:#5c6270;">× ${escape(item?.quantity)}</span>
          ${[item?.size, item?.color, item?.printArea].filter(Boolean).length ? `<br><span style="color:#5c6270;font-size:12px;">${escape([item?.size, item?.color, item?.printArea].filter(Boolean).join(' • '))}</span>` : ''}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #eef0f3;font-size:14px;text-align:right;white-space:nowrap;">${escape(formatPrice(item?.totalPrice, lang))}</td>
      </tr>`,
    )
    .join('');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
    ${items}
    <tr><td style="padding:8px 0;font-size:14px;color:#5c6270;">${sq ? 'Nëntotali' : 'Subtotal'}</td><td style="padding:8px 0;font-size:14px;text-align:right;">${escape(formatPrice(order?.subtotal, lang))}</td></tr>
    <tr><td style="padding:2px 0;font-size:14px;color:#5c6270;">${sq ? 'Transporti' : 'Shipping'}</td><td style="padding:2px 0;font-size:14px;text-align:right;">${order?.shippingCost ? escape(formatPrice(order.shippingCost, lang)) : (sq ? 'Falas' : 'Free')}</td></tr>
    <tr><td style="padding:10px 0 0;font-size:16px;font-weight:700;">${sq ? 'Totali' : 'Total'}</td><td style="padding:10px 0 0;font-size:16px;font-weight:700;text-align:right;">${escape(formatPrice(order?.total, lang))}</td></tr>
  </table>`;
}

export function orderAdminEmail(order: any, lang: Lang = 'sq') {
  const sq = lang === 'sq';
  const body =
    rows([
      [sq ? 'Porosia' : 'Order', order?.orderNumber],
      [sq ? 'Klienti' : 'Customer', order?.shippingName],
      ['Email', order?.customerEmail ?? order?.user?.email],
      [sq ? 'Telefoni' : 'Phone', order?.shippingPhone],
      [sq ? 'Adresa' : 'Address', [order?.shippingAddress, order?.shippingCity].filter(Boolean).join(', ')],
      [sq ? 'Pagesa' : 'Payment', order?.paymentMethod === 'bank' ? (sq ? 'Transfertë bankare' : 'Bank transfer') : (sq ? 'Para në dorë' : 'Cash on delivery')],
      [sq ? 'Shënime' : 'Notes', order?.shippingNotes],
    ]) +
    orderItemsTable(order, lang) +
    button(`${siteUrl()}/admin`, sq ? 'Hap panelin' : 'Open admin panel');

  return {
    subject: sq ? `Porosi e re ${order?.orderNumber ?? ''}` : `New order ${order?.orderNumber ?? ''}`,
    html: layout(sq ? 'Porosi e re' : 'New order', body, sq ? `Dërguar nga ${BRAND}` : `Sent by ${BRAND}`),
  };
}

export function orderCustomerEmail(order: any, lang: Lang = 'sq') {
  const sq = lang === 'sq';
  const intro = sq
    ? `<p style="margin:0;font-size:15px;line-height:1.7;">Përshëndetje ${escape(order?.shippingName)},</p>
       <p style="margin:14px 0 0;font-size:15px;line-height:1.7;">Porosia juaj <strong>${escape(order?.orderNumber)}</strong> u regjistrua. Do t’ju kontaktojmë për të konfirmuar detajet dhe afatin e dorëzimit.</p>`
    : `<p style="margin:0;font-size:15px;line-height:1.7;">Hello ${escape(order?.shippingName)},</p>
       <p style="margin:14px 0 0;font-size:15px;line-height:1.7;">Your order <strong>${escape(order?.orderNumber)}</strong> has been placed. We will contact you to confirm the details and delivery time.</p>`;

  return {
    subject: sq ? `Porosia ${order?.orderNumber ?? ''} u regjistrua` : `Order ${order?.orderNumber ?? ''} received`,
    html: layout(sq ? 'Faleminderit për porosinë' : 'Thank you for your order', intro + orderItemsTable(order, lang), sq ? 'Ky email u dërgua automatikisht.' : 'This email was sent automatically.'),
  };
}

const ORDER_STATUS_TEXT: Record<string, { sq: string; en: string }> = {
  pending: { sq: 'në pritje', en: 'pending' },
  confirmed: { sq: 'e konfirmuar', en: 'confirmed' },
  in_production: { sq: 'në prodhim', en: 'in production' },
  shipped: { sq: 'e nisur për dorëzim', en: 'shipped' },
  delivered: { sq: 'e dorëzuar', en: 'delivered' },
  cancelled: { sq: 'e anuluar', en: 'cancelled' },
};

export function orderStatusEmail(order: any, lang: Lang = 'sq') {
  const sq = lang === 'sq';
  const label = ORDER_STATUS_TEXT[order?.status]?.[sq ? 'sq' : 'en'] ?? order?.status;
  const body = sq
    ? `<p style="margin:0;font-size:15px;line-height:1.7;">Porosia juaj <strong>${escape(order?.orderNumber)}</strong> tani është <strong>${escape(label)}</strong>.</p>`
    : `<p style="margin:0;font-size:15px;line-height:1.7;">Your order <strong>${escape(order?.orderNumber)}</strong> is now <strong>${escape(label)}</strong>.</p>`;

  return {
    subject: sq ? `Porosia ${order?.orderNumber ?? ''}: ${label}` : `Order ${order?.orderNumber ?? ''}: ${label}`,
    html: layout(sq ? 'Përditësim i porosisë' : 'Order update', body, sq ? 'Ky email u dërgua automatikisht.' : 'This email was sent automatically.'),
  };
}
