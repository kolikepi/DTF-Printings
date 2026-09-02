'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/animate';
import { Send, Upload, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function QuoteClient() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', productType: '', quantity: '', description: '' });
  const [designCloudPath, setDesignCloudPath] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, fileSize: file.size, isPublic: false }),
      });
      const data = await res?.json();
      if (!data?.uploadUrl) throw new Error('No upload URL');
      const signedHeaders = new URL(data.uploadUrl).searchParams?.get('X-Amz-SignedHeaders') ?? '';
      const headers: Record<string, string> = { 'Content-Type': file.type };
      if (signedHeaders?.includes('content-disposition')) headers['Content-Disposition'] = 'attachment';
      await fetch(data.uploadUrl, { method: 'PUT', headers, body: file });
      setDesignCloudPath(data?.cloud_storage_path ?? '');
      toast.success(lang === 'sq' ? 'Skedari u ngarkua!' : 'File uploaded!');
    } catch { toast.error(t('common.error')); }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, designCloudPath, designIsPublic: false, website: honeypot, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res?.ok) { setFieldErrors({}); setSent(true); toast.success(t('quote.success')); }
      else { setFieldErrors(data?.fields ?? {}); toast.error(data?.error ?? t('common.error')); }
    } catch { toast.error(t('common.error')); }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"><Check className="h-8 w-8 text-green-600" /></div>
          <h2 className="font-display text-2xl font-bold mb-2">{t('quote.success')}</h2>
          <p className="text-muted-foreground">{lang === 'sq' ? 'Do t’ju kontaktojmë brenda 24 orësh.' : 'We will contact you within 24 hours.'}</p>
        </div>
      </div>
    );
  }

  const productTypes = [
    { value: 'tshirt', label: lang === 'sq' ? 'Bluzë' : 'T-Shirt' },
    { value: 'hoodie', label: lang === 'sq' ? 'Hoodie' : 'Hoodie' },
    { value: 'sweatshirt', label: 'Sweatshirt' },
    { value: 'polo', label: lang === 'sq' ? 'Polo' : 'Polo Shirt' },
    { value: 'sportswear', label: lang === 'sq' ? 'Veshje sportive' : 'Sportswear' },
    { value: 'workwear', label: lang === 'sq' ? 'Uniforma pune' : 'Workwear' },
    { value: 'other', label: lang === 'sq' ? 'Tjetër' : 'Other' },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[700px] px-4">
        <FadeIn>
          <div className="text-center mb-8">
            <FileText className="h-10 w-10 text-primary mx-auto mb-4" />
            <h1 className="font-display text-4xl font-bold tracking-tight mb-4">{t('quote.title')}</h1>
            <p className="text-muted-foreground">{t('quote.desc')}</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card className="p-6">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium mb-1 block">{t('contact.name')} *</label><Input value={form.name} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), name: e?.target?.value ?? '' }))} required /></div>
                  <div><label className="text-sm font-medium mb-1 block">{t('contact.email')} *</label><Input type="email" value={form.email} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), email: e?.target?.value ?? '' }))} required /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium mb-1 block">{t('contact.phone')}</label><Input value={form.phone} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), phone: e?.target?.value ?? '' }))} /></div>
                  <div><label className="text-sm font-medium mb-1 block">{t('quote.company')}</label><Input value={form.company} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), company: e?.target?.value ?? '' }))} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('quote.productType')}</label>
                    <select value={form.productType} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), productType: e?.target?.value ?? '' }))}
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background">
                      <option value="">{lang === 'sq' ? 'Zgjidhni…' : 'Select...'}</option>
                      {productTypes?.map((pt: any) => <option key={pt?.value} value={pt?.value}>{pt?.label}</option>)}
                    </select>
                  </div>
                  <div><label className="text-sm font-medium mb-1 block">{t('quote.quantity')}</label><Input type="number" min="1" value={form.quantity} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), quantity: e?.target?.value ?? '' }))} /></div>
                </div>
                <div><label className="text-sm font-medium mb-1 block">{t('quote.description')} *</label><Textarea rows={4} value={form.description} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), description: e?.target?.value ?? '' }))} required /></div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('quote.uploadDesign')}</label>
                  <div className="border border-dashed border-input rounded-md p-4 text-center">
                    {designCloudPath ? (
                      <div className="flex items-center gap-2 justify-center text-green-600"><Check className="h-5 w-5" /><span className="text-sm">{lang === 'sq' ? 'Skedari u ngarkua' : 'File uploaded'}</span></div>
                    ) : (<><Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">PNG, JPG</p></>)}
                    <input type="file" accept=".png,.jpg,.jpeg" onChange={handleUpload} className="hidden" id="quote-upload" />
                    <label htmlFor="quote-upload"><Button variant="outline" size="sm" asChild className="mt-2" disabled={uploading}><span>{uploading ? t('common.loading') : (lang === 'sq' ? 'Zgjidh skedarin' : 'Choose File')}</span></Button></label>
                  </div>
                </div>
                {/* Fushë karrem: e plotësojnë vetëm robotët. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  value={honeypot}
                  onChange={(e: any) => setHoneypot(e?.target?.value ?? '')}
                />
                <Button type="submit" disabled={sending} className="w-full"><Send className="h-4 w-4 mr-2" />{sending ? t('common.loading') : t('quote.submit')}</Button>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
