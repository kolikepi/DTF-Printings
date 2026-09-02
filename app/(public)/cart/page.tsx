'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/language-context';
import { colorLabel, printAreaLabel } from '@/lib/catalog-labels';
import { amountToFreeShipping, formatPrice, lineTotal, shippingFor, subtotalFor, unitPriceFor, discountFor } from '@/lib/pricing';
import { CART_EVENT, readGuestCart, removeGuestCartItem, updateGuestCartItem } from '@/lib/guest-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/animate';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const { t, lang } = useLanguage();
  const { data: session } = useSession() || {};
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const guest = !session?.user;

  const fetchCart = useCallback(async () => {
    // Klienti me llogari e ka shportën te serveri; vizitori te browser-i i vet.
    if (guest) {
      setItems(readGuestCart().map((line) => ({ ...line, product: line })));
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/cart');
      if (res?.ok) { const data = await res.json(); setItems(data?.items ?? []); }
    } catch { /* ignore */ }
    setLoading(false);
  }, [guest]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  useEffect(() => {
    if (!guest) return;
    const sync = () => fetchCart();
    window.addEventListener(CART_EVENT, sync);
    return () => window.removeEventListener(CART_EVENT, sync);
  }, [guest, fetchCart]);

  const removeItem = async (id: string) => {
    if (guest) { removeGuestCartItem(id); fetchCart(); return; }
    try { await fetch(`/api/cart/${id}`, { method: 'DELETE' }); fetchCart(); } catch { toast.error(t('common.error')); }
  };

  const updateQty = async (id: string, qty: number) => {
    if (guest) { updateGuestCartItem(id, Math.max(1, qty)); fetchCart(); return; }
    try { await fetch(`/api/cart/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: Math.max(1, qty) }) }); fetchCart(); } catch { /* ignore */ }
  };

  const subtotal = subtotalFor((items ?? []).map((i: any) => ({ basePrice: i?.product?.basePrice ?? 0, quantity: i?.quantity ?? 1 })));
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <FadeIn>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-8">{t('cart.title')}</h1>
        </FadeIn>

        {loading ? (<p className="text-muted-foreground">{t('common.loading')}</p>) : (items?.length ?? 0) === 0 ? (
          <div className="text-center py-16"><ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground mb-4">{t('cart.empty')}</p><Link href="/products"><Button>{t('hero.ctaSecondary')}</Button></Link></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {(items ?? []).map((item: any) => (
                <Card key={item?.id} className="p-4">
                  <CardContent className="flex gap-4">
                    <div className="relative w-20 h-20 rounded bg-muted flex-shrink-0"><Image src={item?.product?.imageUrl ?? '/images/portfolio-gallery.png'} alt={item?.product?.name ?? ''} fill className="object-cover rounded" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{lang === 'sq' ? (item?.product?.nameAl ?? item?.product?.name) : (item?.product?.name ?? '')}</h3>
                      <p className="text-sm text-muted-foreground">{[item?.size, colorLabel(item?.color, lang), printAreaLabel(item?.printArea, lang)].filter(Boolean).join(' • ')}</p>
                      <p className="font-bold text-primary mt-1">
                        {formatPrice(lineTotal(item?.product?.basePrice ?? 0, item?.quantity ?? 1), lang)}
                        {discountFor(item?.quantity ?? 1) > 0 && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                            {formatPrice(unitPriceFor(item?.product?.basePrice ?? 0, item?.quantity ?? 1), lang)} / {lang === 'sq' ? 'copë' : 'pc'} · −{Math.round(discountFor(item?.quantity ?? 1) * 100)}%
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => removeItem(item?.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon-sm" onClick={() => updateQty(item?.id, (item?.quantity ?? 1) - 1)}><Minus className="h-3 w-3" /></Button>
                        <span className="text-sm font-medium w-6 text-center">{item?.quantity ?? 1}</span>
                        <Button variant="outline" size="icon-sm" onClick={() => updateQty(item?.id, (item?.quantity ?? 1) + 1)}><Plus className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="p-6 sticky top-20">
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>{t('cart.subtotal')}</span><span className="font-medium">{formatPrice(subtotal, lang)}</span></div>
                    <div className="flex justify-between"><span>{t('cart.shipping')}</span><span className="font-medium">{shipping === 0 ? (lang === 'sq' ? 'Falas' : 'Free') : formatPrice(shipping, lang)}</span></div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold"><span>{t('cart.total')}</span><span className="text-primary">{formatPrice(total, lang)}</span></div>
                  </div>
                  <Link href="/checkout" className="block mt-4">
                    <Button className="w-full">{t('cart.checkout')} <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {lang === 'sq'
                        ? `Shto edhe ${formatPrice(amountToFreeShipping(subtotal), 'sq')} për transport falas`
                        : `Add ${formatPrice(amountToFreeShipping(subtotal), 'en')} more for free shipping`}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
