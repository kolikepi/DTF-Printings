'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, SlideIn } from '@/components/ui/animate';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res?.ok) {
        toast.success(t('contact.success'));
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error(t('common.error'));
      }
    } catch {
      toast.error(t('common.error'));
    }
    setSending(false);
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold tracking-tight text-center mb-4">{t('contact.pageTitle')}</h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{t('contact.pageDesc')}</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SlideIn from="left" className="lg:col-span-2">
            <Card className="p-6">
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">{t('contact.name')} *</label>
                      <Input value={form.name} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), name: e?.target?.value ?? '' }))} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">{t('contact.email')} *</label>
                      <Input type="email" value={form.email} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), email: e?.target?.value ?? '' }))} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">{t('contact.phone')}</label>
                      <Input value={form.phone} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), phone: e?.target?.value ?? '' }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">{t('contact.subject')}</label>
                      <Input value={form.subject} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), subject: e?.target?.value ?? '' }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('contact.message')} *</label>
                    <Textarea rows={5} value={form.message} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), message: e?.target?.value ?? '' }))} required />
                  </div>
                  <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                    <Send className="h-4 w-4 mr-2" /> {sending ? t('common.loading') : t('contact.send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </SlideIn>

          <SlideIn from="right">
            <div className="space-y-4">
              <Card className="p-5">
                <CardContent className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Phone className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-sm font-medium">{t('contact.phone')}</p><a href="tel:+355692055861" className="text-sm text-muted-foreground hover:text-primary">+355 69 205 5861</a></div>
                </CardContent>
              </Card>
              <Card className="p-5">
                <CardContent className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Mail className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-sm font-medium">{t('contact.email')}</p><a href="mailto:kolikepi@gmail.com" className="text-sm text-muted-foreground hover:text-primary">kolikepi@gmail.com</a></div>
                </CardContent>
              </Card>
              <Card className="p-5">
                <CardContent className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><MapPin className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-sm font-medium">{lang === 'sq' ? 'Adresa' : 'Address'}</p><p className="text-sm text-muted-foreground">Tiranë, Shqipëri</p></div>
                </CardContent>
              </Card>
              <a href="https://wa.me/355692055861" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white mt-2">
                  <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                </Button>
              </a>
            </div>
          </SlideIn>
        </div>
      </div>
    </div>
  );
}
