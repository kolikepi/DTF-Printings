'use client';

/**
 * Shporta e vizitorit pa llogari, e ruajtur te browser-i i tij.
 * Çmimet këtu janë vetëm për shfaqje — kur bëhet porosia, serveri i rillogarit
 * nga databaza, ndaj një shportë e manipuluar nuk ndryshon dot asgjë.
 */

export type GuestCartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  nameAl: string | null;
  imageUrl: string | null;
  basePrice: number;
  quantity: number;
  size: string | null;
  color: string | null;
  printArea: string | null;
  designCloudPath: string | null;
  designIsPublic: boolean;
  notes: string | null;
};

const KEY = 'elev8:cart';
export const CART_EVENT = 'elev8:cart-changed';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function readGuestCart(): GuestCartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestCart(items: GuestCartItem[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // hapësira e mbushur ose modaliteti privat — shporta thjesht nuk ruhet
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

/** Dy artikuj bashkohen vetëm kur produkti dhe të gjitha opsionet përputhen. */
function sameLine(a: GuestCartItem, b: Omit<GuestCartItem, 'id' | 'quantity'>) {
  return (
    a.productId === b.productId &&
    (a.size ?? '') === (b.size ?? '') &&
    (a.color ?? '') === (b.color ?? '') &&
    (a.printArea ?? '') === (b.printArea ?? '') &&
    (a.designCloudPath ?? '') === (b.designCloudPath ?? '')
  );
}

export function addToGuestCart(item: Omit<GuestCartItem, 'id'>) {
  const items = readGuestCart();
  const existing = items.find((line) => sameLine(line, item));
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    items.unshift({ ...item, id: `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}` });
  }
  writeGuestCart(items);
}

export function updateGuestCartItem(id: string, quantity: number) {
  const items = readGuestCart().map((line) => (line.id === id ? { ...line, quantity: Math.max(1, quantity) } : line));
  writeGuestCart(items);
}

export function removeGuestCartItem(id: string) {
  writeGuestCart(readGuestCart().filter((line) => line.id !== id));
}

export function clearGuestCart() {
  writeGuestCart([]);
}

export function guestCartCount() {
  return readGuestCart().length;
}

/** Formati që pret /api/orders dhe /api/cart. */
export function guestCartPayload() {
  return readGuestCart().map((line) => ({
    productId: line.productId,
    quantity: line.quantity,
    size: line.size,
    color: line.color,
    printArea: line.printArea,
    designCloudPath: line.designCloudPath,
    designIsPublic: line.designIsPublic,
    notes: line.notes,
  }));
}
