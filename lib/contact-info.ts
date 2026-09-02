/**
 * Të dhënat e kontaktit në një vend të vetëm. Ndryshoji këtu (ose me variabla
 * mjedisi) dhe ndryshojnë te faqja, footer-i, butoni i WhatsApp-it dhe SEO-ja.
 */

export const BUSINESS = {
  name: 'Elev8 Printings',
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? 'Elev8 Printings',
  phone: process.env.NEXT_PUBLIC_PHONE ?? '+355 69 205 5861',
  email: process.env.NEXT_PUBLIC_EMAIL ?? 'kolikepi@gmail.com',
  city: process.env.NEXT_PUBLIC_CITY ?? 'Tiranë',
  country: 'Shqipëri',
  address: process.env.NEXT_PUBLIC_ADDRESS ?? 'Tiranë, Shqipëri',
  nipt: process.env.NEXT_PUBLIC_NIPT ?? '',
  openingHours: process.env.NEXT_PUBLIC_OPENING_HOURS ?? 'Mo-Sa 09:00-18:00',
};

/** Numri pa hapësira e simbole, siç e do WhatsApp-i. */
export function whatsappNumber() {
  return (process.env.NEXT_PUBLIC_WHATSAPP ?? BUSINESS.phone).replace(/[^\d]/g, '');
}

/** Lidhje WhatsApp me mesazhin gati për t’u dërguar. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${whatsappNumber()}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink() {
  return `tel:${BUSINESS.phone.replace(/\s/g, '')}`;
}
