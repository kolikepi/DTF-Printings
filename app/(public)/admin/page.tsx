'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-context';
import { colorLabel, printAreaLabel } from '@/lib/catalog-labels';
import { formatPrice } from '@/lib/pricing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/animate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Mail, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const ORDER_STATUSES = [
  { value: 'pending', sq: 'Në pritje', en: 'Pending' },
  { value: 'confirmed', sq: 'E konfirmuar', en: 'Confirmed' },
  { value: 'in_production', sq: 'Në prodhim', en: 'In production' },
  { value: 'shipped', sq: 'E nisur', en: 'Shipped' },
  { value: 'delivered', sq: 'E dorëzuar', en: 'Delivered' },
  { value: 'cancelled', sq: 'E anuluar', en: 'Cancelled' },
];

const REQUEST_STATUSES = [
  { value: 'new', sq: 'E re', en: 'New' },
  { value: 'in_progress', sq: 'Në punë', en: 'In progress' },
  { value: 'answered', sq: 'E përgjigjur', en: 'Answered' },
  { value: 'closed', sq: 'E mbyllur', en: 'Closed' },
];

function statusLabel(list: typeof ORDER_STATUSES, value: string, lang: 'sq' | 'en') {
  return list.find((s) => s.value === value)?.[lang] ?? value;
}

/** Statuset e mbyllura marrin ngjyrë të qetë, ato që kërkojnë veprim bien në sy. */
function statusTone(value: string) {
  if (['delivered', 'answered', 'closed'].includes(value)) return 'secondary' as const;
  if (['cancelled'].includes(value)) return 'destructive' as const;
  return 'default' as const;
}

function StatusPicker({
  options,
  value,
  disabled,
  onPick,
  lang,
}: {
  options: typeof ORDER_STATUSES;
  value: string;
  disabled?: boolean;
  onPick: (next: string) => void;
  lang: 'sq' | 'en';
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {options.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={option.value === value ? 'default' : 'outline'}
          disabled={disabled}
          onClick={() => onPick(option.value)}
        >
          {option[lang]}
        </Button>
      ))}
    </div>
  );
}

function AdminNote({
  value,
  disabled,
  onSave,
  lang,
}: {
  value: string;
  disabled?: boolean;
  onSave: (note: string) => void;
  lang: 'sq' | 'en';
}) {
  const [note, setNote] = useState(value ?? '');
  const dirty = (note ?? '') !== (value ?? '');

  return (
    <div className="mt-3">
      <textarea
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        rows={2}
        placeholder={lang === 'sq' ? 'Shënim i brendshëm (nuk e sheh klienti)' : 'Internal note (not visible to the customer)'}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {dirty && (
        <Button size="sm" variant="secondary" className="mt-2" disabled={disabled} onClick={() => onSave(note)}>
          {lang === 'sq' ? 'Ruaj shënimin' : 'Save note'}
        </Button>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') { router.replace('/login'); return; }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') { router.replace('/'); return; }
  }, [status, session, router]);

  const load = useCallback(() => {
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

  useEffect(() => { load(); }, [load]);

  const update = async (endpoint: string, id: string, patch: Record<string, unknown>, successText: string) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) throw new Error('failed');
      toast.success(successText);
      load();
    } catch {
      toast.error(t('common.error'));
    }
    setSaving('');
  };

  const statusSaved = lang === 'sq' ? 'Statusi u ndryshua' : 'Status updated';
  const noteSaved = lang === 'sq' ? 'Shënimi u ruajt' : 'Note saved';
  const openCount = (list: any[], done: string[]) => (list ?? []).filter((x: any) => !done.includes(x?.status)).length;

  if (status === 'loading' || loading) return <div className="py-20 text-center text-muted-foreground">{t('common.loading')}</div>;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <FadeIn>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-8">{lang === 'sq' ? 'Paneli i adminit' : 'Admin panel'}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-4"><CardContent className="flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{orders?.length ?? 0}</p>
                <p className="text-sm text-muted-foreground">
                  {lang === 'sq' ? 'Porosi' : 'Orders'} · {openCount(orders, ['delivered', 'cancelled'])} {lang === 'sq' ? 'të hapura' : 'open'}
                </p>
              </div>
            </CardContent></Card>
            <Card className="p-4"><CardContent className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{quotes?.length ?? 0}</p>
                <p className="text-sm text-muted-foreground">
                  {lang === 'sq' ? 'Kërkesa oferte' : 'Quotes'} · {openCount(quotes, ['answered', 'closed'])} {lang === 'sq' ? 'pa përgjigje' : 'unanswered'}
                </p>
              </div>
            </CardContent></Card>
            <Card className="p-4"><CardContent className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{contacts?.length ?? 0}</p>
                <p className="text-sm text-muted-foreground">
                  {lang === 'sq' ? 'Mesazhe' : 'Messages'} · {openCount(contacts, ['answered', 'closed'])} {lang === 'sq' ? 'të palexuara' : 'open'}
                </p>
              </div>
            </CardContent></Card>
          </div>

          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">{lang === 'sq' ? 'Porosi' : 'Orders'}</TabsTrigger>
              <TabsTrigger value="quotes">{lang === 'sq' ? 'Oferta' : 'Quotes'}</TabsTrigger>
              <TabsTrigger value="contacts">{lang === 'sq' ? 'Mesazhe' : 'Messages'}</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-4 space-y-3">
              {(orders ?? []).map((order: any) => (
                <Card key={order?.id} className="p-4"><CardContent>
                  <div className="flex justify-between items-center gap-3">
                    <span className="font-mono font-bold">{order?.orderNumber}</span>
                    <Badge variant={statusTone(order?.status)}>{statusLabel(ORDER_STATUSES, order?.status, lang)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {[order?.shippingName, order?.customerEmail ?? order?.user?.email, order?.shippingPhone].filter(Boolean).join(' · ')}
                    {!order?.userId && <span className="ml-2 text-xs uppercase tracking-wide">{lang === 'sq' ? 'vizitor' : 'guest'}</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[order?.shippingAddress, order?.shippingCity].filter(Boolean).join(', ')}
                  </p>
                  <ul className="text-sm mt-2 space-y-0.5">
                    {(order?.items ?? []).map((item: any) => (
                      <li key={item?.id}>
                        {lang === 'sq' ? (item?.product?.nameAl ?? item?.product?.name) : item?.product?.name} × {item?.quantity}
                        <span className="text-muted-foreground">
                          {' '}{[item?.size, colorLabel(item?.color, lang), printAreaLabel(item?.printArea, lang)].filter(Boolean).join(' • ')}
                        </span>
                        {item?.designCloudPath && (
                          <a className="text-primary underline ml-2" href={`/api/upload/download?path=${encodeURIComponent(item.designCloudPath)}`}>
                            {lang === 'sq' ? 'dizajni' : 'design'}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="font-semibold mt-2">{formatPrice(order?.total, lang)}</p>
                  <StatusPicker
                    options={ORDER_STATUSES}
                    value={order?.status}
                    disabled={saving === order?.id}
                    lang={lang}
                    onPick={(next) => update('orders', order.id, { status: next }, statusSaved)}
                  />
                  <AdminNote
                    value={order?.adminNote ?? ''}
                    disabled={saving === order?.id}
                    lang={lang}
                    onSave={(note) => update('orders', order.id, { adminNote: note }, noteSaved)}
                  />
                </CardContent></Card>
              ))}
              {(orders?.length ?? 0) === 0 && <p className="text-muted-foreground text-center py-8">{lang === 'sq' ? 'Asnjë porosi.' : 'No orders.'}</p>}
            </TabsContent>

            <TabsContent value="quotes" className="mt-4 space-y-3">
              {(quotes ?? []).map((quote: any) => (
                <Card key={quote?.id} className="p-4"><CardContent>
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold">{quote?.name}</span>
                    <Badge variant={statusTone(quote?.status)}>{statusLabel(REQUEST_STATUSES, quote?.status, lang)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[quote?.email, quote?.phone, quote?.company].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[quote?.productType, quote?.quantity ? `${quote.quantity} ${lang === 'sq' ? 'copë' : 'pcs'}` : null].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{quote?.description}</p>
                  {quote?.designCloudPath && (
                    <a
                      className="text-sm text-primary underline mt-1 inline-block"
                      href={`/api/upload/download?path=${encodeURIComponent(quote.designCloudPath)}`}
                    >
                      {lang === 'sq' ? 'Shkarko dizajnin' : 'Download design'}
                    </a>
                  )}
                  <div className="mt-2">
                    <a className="text-sm text-primary underline" href={`mailto:${quote?.email}`}>
                      {lang === 'sq' ? 'Përgjigju me email' : 'Reply by email'}
                    </a>
                  </div>
                  <StatusPicker
                    options={REQUEST_STATUSES}
                    value={quote?.status}
                    disabled={saving === quote?.id}
                    lang={lang}
                    onPick={(next) => update('quotes', quote.id, { status: next }, statusSaved)}
                  />
                  <AdminNote
                    value={quote?.adminNote ?? ''}
                    disabled={saving === quote?.id}
                    lang={lang}
                    onSave={(note) => update('quotes', quote.id, { adminNote: note }, noteSaved)}
                  />
                </CardContent></Card>
              ))}
              {(quotes?.length ?? 0) === 0 && <p className="text-muted-foreground text-center py-8">{lang === 'sq' ? 'Asnjë kërkesë.' : 'No quotes.'}</p>}
            </TabsContent>

            <TabsContent value="contacts" className="mt-4 space-y-3">
              {(contacts ?? []).map((msg: any) => (
                <Card key={msg?.id} className="p-4"><CardContent>
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold">{msg?.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{msg?.createdAt ? new Date(msg.createdAt).toLocaleDateString(lang === 'sq' ? 'sq-AL' : 'en-GB') : ''}</span>
                      <Badge variant={statusTone(msg?.status)}>{statusLabel(REQUEST_STATUSES, msg?.status, lang)}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{[msg?.email, msg?.phone, msg?.subject].filter(Boolean).join(' · ')}</p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{msg?.message}</p>
                  <div className="mt-2">
                    <a className="text-sm text-primary underline" href={`mailto:${msg?.email}`}>
                      {lang === 'sq' ? 'Përgjigju me email' : 'Reply by email'}
                    </a>
                  </div>
                  <StatusPicker
                    options={REQUEST_STATUSES}
                    value={msg?.status}
                    disabled={saving === msg?.id}
                    lang={lang}
                    onPick={(next) => update('contacts', msg.id, { status: next }, statusSaved)}
                  />
                  <AdminNote
                    value={msg?.adminNote ?? ''}
                    disabled={saving === msg?.id}
                    lang={lang}
                    onSave={(note) => update('contacts', msg.id, { adminNote: note }, noteSaved)}
                  />
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
