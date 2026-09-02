import type { Lang } from '@/lib/translations';

/**
 * Një burim i vetëm për çmimet: transporti, zbritjet sipas sasisë dhe formatimi.
 * E përdorin njësoj faqet dhe API-ja, që klienti të mos shohë kurrë një total
 * të ndryshëm nga ai që ruhet te porosia.
 */

/** Kostoja e transportit dhe pragu i transportit falas (Lekë). */
export const SHIPPING_COST = Number(process.env.NEXT_PUBLIC_SHIPPING_COST ?? 300);
export const FREE_SHIPPING_OVER = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_OVER ?? 5000);

/** Zbritjet me shumicë — ndryshoji këtu dhe ndryshojnë kudo. */
export const QUANTITY_TIERS: { min: number; discount: number }[] = [
  { min: 100, discount: 0.2 },
  { min: 50, discount: 0.15 },
  { min: 25, discount: 0.1 },
  { min: 10, discount: 0.05 },
];

/** Zbritja që i takon një sasie (0 = pa zbritje). */
export function discountFor(quantity: number) {
  const qty = Math.max(1, Math.floor(quantity || 1));
  return QUANTITY_TIERS.find((tier) => qty >= tier.min)?.discount ?? 0;
}

/** Çmimi për copë pas zbritjes së sasisë, i rrumbullakosur në Lekë. */
export function unitPriceFor(basePrice: number, quantity: number) {
  const price = Math.max(0, basePrice || 0);
  return Math.round(price * (1 - discountFor(quantity)));
}

/** Totali i një rreshti në shportë. */
export function lineTotal(basePrice: number, quantity: number) {
  const qty = Math.max(1, Math.floor(quantity || 1));
  return unitPriceFor(basePrice, qty) * qty;
}

/** Totali i të gjitha artikujve, para transportit. */
export function subtotalFor(items: { basePrice: number; quantity: number }[]) {
  return (items ?? []).reduce((sum, item) => sum + lineTotal(item?.basePrice ?? 0, item?.quantity ?? 1), 0);
}

export function shippingFor(subtotal: number) {
  return subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_COST;
}

/** "1.500 Lekë" në shqip, "ALL 1,500" në anglisht. */
export function formatPrice(value: number | null | undefined, lang: Lang = 'sq') {
  const amount = Math.round(value ?? 0);
  if (lang === 'en') {
    return `ALL ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)}`;
  }
  // Shqipja shkruan mijëshet me pikë; CLDR-ja e 'sq' përdor hapësirë, ndaj de-DE.
  return `${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(amount)} Lekë`;
}

/** Sa duhet shtuar për transport falas; 0 nëse është arritur. */
export function amountToFreeShipping(subtotal: number) {
  return Math.max(0, FREE_SHIPPING_OVER - subtotal);
}
