'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/components/language-context';
import { formatPrice, lineTotal, shippingFor, subtotalFor } from '@/lib/pricing';
import { clearGuestCart, guestCartPayload, readGuestCart } from '@/lib/guest-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/animate';
import { CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { t, lang } = useLanguage();
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [form, setForm] = useState({ shippingName: '', shippingAddress: '', shippingCity: 'Tiranë', shippingPhone: '', shippingNotes: '', paymentMethod: 'cash', customerEmail: '', website: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const guest = !session?.user;

  const fetchCart = useCallback(async () => {
    if (guest) {
      setItems(readGuestCart().map((line) => ({ ...line, product: line })));
      setLoading(false);
      return;
    }
    try { const res = await fetch('/api/cart'); if (res?.ok) { const d = await res.json(); setItems(d?.items ?? []); } } catch { /* ignore */ }
    setLoading(false);
  }, [guest]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // Emri dhe email-i plotësohen vetë për klientin që ka hyrë në llogari.
  useEffect(() => {
    const user: any = session?.user;
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      shippingName: prev.shippingName || (user?.name ?? ''),
      customerEmail: prev.customerEmail || (user?.email ?? ''),
    }));
  }, [session?.user]);

  const subtotal = subtotalFor((items ?? []).map((i: any) => ({ basePrice: i?.product?.basePrice ?? 0, quantity: i?.quantity ?? 1 })));
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    setFieldErrors({});
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang, items: guest ? guestCartPayload() : undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (res?.ok) {
        if (guest) clearGuestCart();
        router.replace(`/order-confirmation?order=${data?.order?.orderNumber ?? ''}`);
      } else {
        setFieldErrors(data?.fields ?? {});
        toast.error(data?.error ?? t('common.error'));
      }
    } catch { toast.error(t('common.error')); }
    setPlacing(false);
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground">{t('common.loading')}</div>;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[900px] px-4">
        <FadeIn>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">{t('checkout.title')}</h1>
          {guest && (
            <p className="text-sm text-muted-foreground mb-8">
              {lang === 'sq' ? 'Porositni pa llogari. ' : 'Order without an account. '}
              <Link href="/login" className="text-primary underline">
                {lang === 'sq' ? 'Ose hyni në llogari' : 'Or log in'}
              </Link>
              {lang === 'sq' ? ' për të ruajtur historikun e porosive.' : ' to keep your order history.'}
            </p>
          )}
        </FadeIn>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <Card className="p-6">
                <CardContent>
                  <div className="flex items-center gap-2 mb-4"><Truck className="h-5 w-5 text-primary" /><h2 className="font-semibold text-lg">{t('checkout.shipping')}</h2></div>
                  <div className="space-y-4">
                    <div><label className="text-sm font-medium mb-1 block">{t('checkout.fullName')} *</label><Input value={form.shippingName} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), shippingName: e?.target?.value ?? '' }))} required /></div>
                    <div><label className="text-sm font-medium mb-1 block">{t('checkout.address')} *</label><Input value={form.shippingAddress} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), shippingAddress: e?.target?.value ?? '' }))} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium mb-1 block">{t('checkout.city')} *</label><Input value={form.shippingCity} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), shippingCity: e?.target?.value ?? '' }))} required /></div>
                      <div><label className="text-sm font-medium mb-1 block">{t('checkout.phone')} *</label><Input value={form.shippingPhone} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), shippingPhone: e?.target?.value ?? '' }))} required /></div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email *</label>
                      <Input
                        type="email"
                        value={form.customerEmail}
                        onChange={(e: any) => setForm(p => ({ ...(p ?? {}), customerEmail: e?.target?.value ?? '' }))}
                        required
                      />
                      {fieldErrors.customerEmail && <p className="text-xs text-destructive mt-1">{fieldErrors.customerEmail}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {lang === 'sq' ? 'Këtu ju dërgojmë konfirmimin e porosisë.' : 'We send the order confirmation here.'}
                      </p>
                    </div>
                    <div><label className="text-sm font-medium mb-1 block">{t('checkout.notes')}</label><Textarea rows={3} value={form.shippingNotes} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), shippingNotes: e?.target?.value ?? '' }))} /></div>
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                      value={form.website}
                      onChange={(e: any) => setForm(p => ({ ...(p ?? {}), website: e?.target?.value ?? '' }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent>
                  <div className="flex items-center gap-2 mb-4"><CreditCard className="h-5 w-5 text-primary" /><h2 className="font-semibold text-lg">{t('checkout.payment')}</h2></div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50">
                      <input type="radio" name="payment" value="cash" checked={form.paymentMethod === 'cash'} onChange={() => setForm(p => ({ ...(p ?? {}), paymentMethod: 'cash' }))} />
                      <span className="text-sm font-medium">{t('checkout.cash')}</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50">
                      <input type="radio" name="payment" value="bank" checked={form.paymentMethod === 'bank'} onChange={() => setForm(p => ({ ...(p ?? {}), paymentMethod: 'bank' }))} />
                      <span className="text-sm font-medium">{t('checkout.bankTransfer')}</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="p-6 sticky top-20">
                <CardContent>
                  <div className="flex items-center gap-2 mb-4"><ShoppingBag className="h-5 w-5 text-primary" /><h2 className="font-semibold">{lang === 'sq' ? 'Përmbledhja' : 'Summary'}</h2></div>
                  <div className="space-y-2 text-sm mb-4">
                    {(items ?? []).map((item: any) => (
                      <div key={item?.id} className="flex justify-between"><span className="truncate pr-2">{lang === 'sq' ? (item?.product?.nameAl ?? item?.product?.name) : (item?.product?.name ?? '')} x{item?.quantity ?? 1}</span><span>{formatPrice(lineTotal(item?.product?.basePrice ?? 0, item?.quantity ?? 1), lang)}</span></div>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm border-t pt-3">
                    <div className="flex justify-between"><span>{t('cart.subtotal')}</span><span>{formatPrice(subtotal, lang)}</span></div>
                    <div className="flex justify-between"><span>{t('cart.shipping')}</span><span>{shipping === 0 ? (lang === 'sq' ? 'Falas' : 'Free') : formatPrice(shipping, lang)}</span></div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>{t('cart.total')}</span><span className="text-primary">{formatPrice(total, lang)}</span></div>
                  </div>
                  <Button type="submit" className="w-full mt-4" disabled={placing || (items?.length ?? 0) === 0}>
                    {placing ? t('common.loading') : t('checkout.placeOrder')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
