'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/language-context';
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

  const fetchCart = useCallback(async () => {
    if (!session?.user) { setItems([]); setLoading(false); return; }
    try {
      const res = await fetch('/api/cart');
      if (res?.ok) { const data = await res.json(); setItems(data?.items ?? []); }
    } catch { /* ignore */ }
    setLoading(false);
  }, [session?.user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const removeItem = async (id: string) => {
    try { await fetch(`/api/cart/${id}`, { method: 'DELETE' }); fetchCart(); } catch { toast.error(t('common.error')); }
  };

  const updateQty = async (id: string, qty: number) => {
    try { await fetch(`/api/cart/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: Math.max(1, qty) }) }); fetchCart(); } catch { /* ignore */ }
  };

  const subtotal = (items ?? []).reduce((s: number, i: any) => s + ((i?.product?.basePrice ?? 0) * (i?.quantity ?? 1)), 0);
  const shipping = subtotal >= 5000 ? 0 : 300;
  const total = subtotal + shipping;

  if (!session?.user) {
    return (<div className="py-20 text-center"><ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground mb-4">{lang === 'sq' ? 'Hyr në llogarinë për të parë shportën.' : 'Log in to view your cart.'}</p><Link href="/login"><Button>{t('nav.login')}</Button></Link></div>);
  }

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
                      <p className="text-sm text-muted-foreground">{[item?.size, item?.color, item?.printArea].filter(Boolean).join(' • ')}</p>
                      <p className="font-bold text-primary mt-1">{item?.product?.basePrice ?? 0} {t('common.lek')}</p>
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
                    <div className="flex justify-between"><span>{t('cart.subtotal')}</span><span className="font-medium">{subtotal} {t('common.lek')}</span></div>
                    <div className="flex justify-between"><span>{t('cart.shipping')}</span><span className="font-medium">{shipping === 0 ? (lang === 'sq' ? 'Falas' : 'Free') : `${shipping} ${t('common.lek')}`}</span></div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold"><span>{t('cart.total')}</span><span className="text-primary">{total} {t('common.lek')}</span></div>
                  </div>
                  <Link href="/checkout" className="block mt-4">
                    <Button className="w-full">{t('cart.checkout')} <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                  {shipping > 0 && <p className="text-xs text-muted-foreground mt-2 text-center">{lang === 'sq' ? 'Transport falas mbi 5,000 Lekë' : 'Free shipping over 5,000 ALL'}</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
