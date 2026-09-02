'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language-context';
import { BUSINESS, telLink } from '@/lib/contact-info';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SiteFooter() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      });
      if (res?.ok) {
        toast.success(t('common.success'));
        setEmail('');
      } else {
        toast.error(t('common.error'));
      }
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold mb-3">
              <span className="text-primary">Elev8</span> Printings
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">{t('footer.description')}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t('footer.quickLinks')}</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link href="/services" className="hover:opacity-100 transition-opacity">{t('nav.services')}</Link>
              <Link href="/products" className="hover:opacity-100 transition-opacity">{t('nav.products')}</Link>
              <Link href="/pricing" className="hover:opacity-100 transition-opacity">{t('nav.pricing')}</Link>
              <Link href="/quote" className="hover:opacity-100 transition-opacity">{t('nav.requestQuote')}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t('footer.contact')}</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <a href={telLink()} className="flex items-center gap-2 hover:opacity-100">
                <Phone className="h-4 w-4" /> {BUSINESS.phone}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 hover:opacity-100">
                <Mail className="h-4 w-4" /> {BUSINESS.email}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {BUSINESS.address}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t('footer.newsletter')}</h4>
            <p className="text-sm opacity-70 mb-3">{t('footer.newsletterDesc')}</p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e?.target?.value ?? '')}
                placeholder="Email" required
                className="flex-1 bg-background/10 border border-background/20 rounded-md px-3 py-2 text-sm placeholder:text-background/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm opacity-60">
          <span>© {new Date().getFullYear()} {BUSINESS.name}. {t('footer.rights')}</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">
              {lang === 'sq' ? 'Privatësia' : 'Privacy'}
            </Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">
              {lang === 'sq' ? 'Kushtet' : 'Terms'}
            </Link>
            <Link href="/shipping-returns" className="hover:opacity-100 transition-opacity">
              {lang === 'sq' ? 'Dorëzimi dhe kthimet' : 'Delivery & returns'}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
