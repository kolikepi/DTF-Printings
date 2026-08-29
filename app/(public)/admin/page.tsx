'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/ui/animate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Users, FileText, Mail, ShoppingBag } from 'lucide-react';

export default function AdminPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') { router.replace('/login'); return; }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') { router.replace('/'); return; }
  }, [status, session, router]);

  useEffect(() => {
    if ((session?.user as any)?.role !== 'admin') return;
    Promise.all([
      fetch('/api/admin/orders').then(r => r?.json()).catch(() => ({ orders: [] })),
      fetch('/api/admin/quotes').then(r => r?.json()).catch(() => ({ quotes: [] })),
      fetch('/api/admin/contacts').then(r => r?.json()).catch(() => ({ contacts: [] })),
    ]).then(([o, q, c]) => {
      setOrders(o?.orders ?? []);
      setQuotes(q?.quotes ?? []);
      setContacts(c?.contacts ?? []);
      setLoading(false);
    });
  }, [session?.user]);

  if (status === 'loading' || loading) return <div className="py-20 text-center text-muted-foreground">{t('common.loading')}</div>;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <FadeIn>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-8">Admin Panel</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-4"><CardContent className="flex items-center gap-3"><ShoppingBag className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{orders?.length ?? 0}</p><p className="text-sm text-muted-foreground">{lang === 'sq' ? 'Porosi' : 'Orders'}</p></div></CardContent></Card>
            <Card className="p-4"><CardContent className="flex items-center gap-3"><FileText className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{quotes?.length ?? 0}</p><p className="text-sm text-muted-foreground">{lang === 'sq' ? 'Kërkesa oferte' : 'Quotes'}</p></div></CardContent></Card>
            <Card className="p-4"><CardContent className="flex items-center gap-3"><Mail className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{contacts?.length ?? 0}</p><p className="text-sm text-muted-foreground">{lang === 'sq' ? 'Mesazhe' : 'Messages'}</p></div></CardContent></Card>
          </div>

          <Tabs defaultValue="orders">
            <TabsList><TabsTrigger value="orders">{lang === 'sq' ? 'Porosi' : 'Orders'}</TabsTrigger><TabsTrigger value="quotes">{lang === 'sq' ? 'Oferta' : 'Quotes'}</TabsTrigger><TabsTrigger value="contacts">{lang === 'sq' ? 'Mesazhe' : 'Messages'}</TabsTrigger></TabsList>

            <TabsContent value="orders" className="mt-4 space-y-3">
              {(orders ?? []).map((order: any) => (
                <Card key={order?.id} className="p-4"><CardContent>
                  <div className="flex justify-between items-center"><span className="font-mono font-bold">{order?.orderNumber}</span><Badge>{order?.status}</Badge></div>
                  <p className="text-sm text-muted-foreground mt-1">{order?.user?.name} - {order?.user?.email}</p>
                  <p className="font-semibold mt-1">{order?.total} {t('common.lek')}</p>
                </CardContent></Card>
              ))}
              {(orders?.length ?? 0) === 0 && <p className="text-muted-foreground text-center py-8">{lang === 'sq' ? 'Asnjë porosi.' : 'No orders.'}</p>}
            </TabsContent>

            <TabsContent value="quotes" className="mt-4 space-y-3">
              {(quotes ?? []).map((quote: any) => (
                <Card key={quote?.id} className="p-4"><CardContent>
                  <div className="flex justify-between"><span className="font-semibold">{quote?.name}</span><Badge>{quote?.status}</Badge></div>
                  <p className="text-sm text-muted-foreground">{quote?.email} - {quote?.productType} - Qty: {quote?.quantity}</p>
                  <p className="text-sm mt-1">{quote?.description}</p>
                  {quote?.designCloudPath && (
                    <a
                      className="text-sm text-primary underline mt-1 inline-block"
                      href={`/api/upload/download?path=${encodeURIComponent(quote.designCloudPath)}`}
                    >
                      {lang === 'sq' ? 'Shkarko dizajnin' : 'Download design'}
                    </a>
                  )}
                </CardContent></Card>
              ))}
              {(quotes?.length ?? 0) === 0 && <p className="text-muted-foreground text-center py-8">{lang === 'sq' ? 'Asnjë kërkesë.' : 'No quotes.'}</p>}
            </TabsContent>

            <TabsContent value="contacts" className="mt-4 space-y-3">
              {(contacts ?? []).map((msg: any) => (
                <Card key={msg?.id} className="p-4"><CardContent>
                  <div className="flex justify-between"><span className="font-semibold">{msg?.name}</span><span className="text-xs text-muted-foreground">{msg?.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}</span></div>
                  <p className="text-sm text-muted-foreground">{msg?.email} - {msg?.subject}</p>
                  <p className="text-sm mt-1">{msg?.message}</p>
                </CardContent></Card>
              ))}
              {(contacts?.length ?? 0) === 0 && <p className="text-muted-foreground text-center py-8">{lang === 'sq' ? 'Asnjë mesazh.' : 'No messages.'}</p>}
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </div>
  );
}
