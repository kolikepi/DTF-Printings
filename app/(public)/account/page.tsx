'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/animate';
import { User, Package, FileText, Settings } from 'lucide-react';

export default function AccountPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  if (status === 'loading') return <div className="py-20 text-center text-muted-foreground">{t('common.loading')}</div>;
  if (!session?.user) return null;

  const links = [
    { href: '/account/orders', icon: Package, label: t('nav.orders'), desc: lang === 'sq' ? 'Shihni historikun e porosive' : 'View order history' },
    { href: '/quote', icon: FileText, label: t('nav.requestQuote'), desc: lang === 'sq' ? 'Kërkoni një ofertë të re' : 'Request a new quote' },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[800px] px-4">
        <FadeIn>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{session?.user?.name ?? t('nav.account')}</h1>
              <p className="text-sm text-muted-foreground">{session?.user?.email ?? ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {links?.map((link: any) => {
              const Icon = link?.icon ?? Settings;
              return (
                <Link key={link?.href} href={link?.href ?? '/'}>
                  <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{link?.label ?? ''}</h3>
                        <p className="text-sm text-muted-foreground">{link?.desc ?? ''}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
