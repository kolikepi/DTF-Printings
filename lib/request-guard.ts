import { NextResponse } from 'next/server';

/**
 * Mbrojtje bazë për formularët publikë: kufi kërkesash për IP, fushë karrem
 * (honeypot) dhe validim i fushave. Kufiri mbahet në memorie — mjafton për një
 * server të vetëm; me disa instanca duhet Redis ose një shërbim i ngjashëm.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/** true = kërkesa lejohet; false = ka kaluar kufirin. */
export function allowRequest(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    return true;
  }

  bucket.count += 1;
  return bucket.count <= limit;
}

export function tooManyRequests(lang: 'sq' | 'en' = 'sq') {
  return NextResponse.json(
    {
      error:
        lang === 'sq'
          ? 'Keni dërguar shumë kërkesa. Provoni sërish pas pak minutash.'
          : 'Too many requests. Please try again in a few minutes.',
    },
    { status: 429 },
  );
}

/** Fusha e fshehur që e plotësojnë vetëm robotët. */
export function isBot(body: any) {
  return typeof body?.website === 'string' && body.website.trim() !== '';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function isEmail(value: unknown) {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value.trim());
}

export function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

/** Numër telefoni shqiptar ose ndërkombëtar, i shkruar lirshëm. */
export function isPhone(value: unknown) {
  if (typeof value !== 'string') return false;
  const digits = value.replace(/[^\d]/g, '');
  return digits.length >= 6 && digits.length <= 15;
}

export type FieldErrors = Record<string, string>;

export function invalid(errors: FieldErrors, lang: 'sq' | 'en' = 'sq') {
  return NextResponse.json(
    {
      error: lang === 'sq' ? 'Të dhënat nuk janë të plota ose të sakta.' : 'The submitted data is incomplete or invalid.',
      fields: errors,
    },
    { status: 400 },
  );
}
