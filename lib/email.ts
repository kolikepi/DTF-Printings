/**
 * Dërgimi i email-eve. Dy rrugë, sipas asaj që gjendet te mjedisi:
 *   - RESEND_API_KEY  → Resend (3.000 email/muaj falas)
 *   - SMTP_HOST …     → çdo server SMTP, p.sh. Gmail
 * Pa asnjërën, email-i thjesht regjistrohet te log-u: faqja vazhdon të punojë,
 * porosia nuk dështon kurrë ngaqë email-i s'u dërgua dot.
 */

export type MailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export type MailResult = { sent: boolean; provider: 'resend' | 'smtp' | 'none'; error?: string };

function fromAddress() {
  return process.env.EMAIL_FROM ?? 'Elev8 Printings <onboarding@resend.dev>';
}

/** Adresa ku njoftohet biznesi për kërkesat e reja. */
export function adminAddress() {
  return process.env.ADMIN_NOTIFY_EMAIL ?? process.env.ADMIN_EMAIL ?? '';
}

function toArray(to: string | string[]) {
  return (Array.isArray(to) ? to : [to]).filter(Boolean);
}

async function sendWithResend(input: MailInput): Promise<MailResult> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: toArray(input.to),
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
  });

  if (!res.ok) {
    return { sent: false, provider: 'resend', error: `${res.status} ${await res.text()}` };
  }
  return { sent: true, provider: 'resend' };
}

async function sendWithSmtp(input: MailInput): Promise<MailResult> {
  const nodemailer = await import('nodemailer');
  const transport = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
  });

  await transport.sendMail({
    from: fromAddress(),
    to: toArray(input.to).join(', '),
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });
  return { sent: true, provider: 'smtp' };
}

/** Nuk hedh kurrë gabim: kthen rezultatin dhe e shkruan problemin te log-u. */
export async function sendMail(input: MailInput): Promise<MailResult> {
  if (!toArray(input.to).length) {
    return { sent: false, provider: 'none', error: 'Asnjë marrës' };
  }

  try {
    if (process.env.RESEND_API_KEY) return await sendWithResend(input);
    if (process.env.SMTP_HOST) return await sendWithSmtp(input);
    console.warn(
      `[email] Asnjë konfigurim (RESEND_API_KEY ose SMTP_HOST). Email-i nuk u dërgua: "${input.subject}" → ${toArray(input.to).join(', ')}`,
    );
    return { sent: false, provider: 'none', error: 'I pakonfiguruar' };
  } catch (error: any) {
    console.error('[email] Dërgimi dështoi:', error?.message ?? error);
    return { sent: false, provider: 'none', error: error?.message ?? 'gabim i panjohur' };
  }
}
