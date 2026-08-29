'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/ui/animate';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-green-100 text-green-800',
  delivered: 'bg-green-200 text-green-900',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/orders').then(r => r?.json()).then(d => { setOrders(d?.orders ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, [session?.user]);

  if (status === 'loading' || loading) return <div className="py-20 text-center text-muted-foreground">{t('common.loading')}</div>;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[800px] px-4">
        <FadeIn>
          <Link href="/account"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />{t('common.back')}</Button></Link>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-8">{t('nav.orders')}</h1>

          {(orders?.length ?? 0) === 0 ? (
            <div className="text-center py-16"><Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">{lang === 'sq' ? 'Nuk keni asnjë porosi.' : 'No orders yet.'}</p></div>
          ) : (
            <div className="space-y-4">
              {(orders ?? []).map((order: any) => (
                <Card key={order?.id} className="p-5">
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-mono text-sm font-bold">{order?.orderNumber ?? ''}</span>
                        <span className="text-xs text-muted-foreground ml-3">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                      <Badge className={statusColors?.[order?.status ?? 'pending'] ?? 'bg-gray-100 text-gray-800'}>{order?.status ?? 'pending'}</Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      {(order?.items ?? []).map((item: any) => (
                        <div key={item?.id} className="flex justify-between">
                          <span>{lang === 'sq' ? (item?.product?.nameAl ?? item?.product?.name) : (item?.product?.name ?? '')} x{item?.quantity ?? 1}</span>
                          <span>{item?.totalPrice ?? 0} {t('common.lek')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                      <span>{t('cart.total')}</span>
                      <span className="text-primary">{order?.total ?? 0} {t('common.lek')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
