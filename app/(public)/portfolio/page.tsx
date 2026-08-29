'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Camera } from 'lucide-react';

export default function PortfolioPage() {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/portfolio').then(r => r?.json()).then(d => setItems(d?.items ?? [])).catch(() => {});
  }, []);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold tracking-tight text-center mb-4">{t('portfolio.pageTitle')}</h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{t('portfolio.pageDesc')}</p>
        </FadeIn>
        {(items?.length ?? 0) === 0 ? (
          <div className="text-center py-20"><Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">{lang === 'sq' ? 'Portofoli do të shtohet së shpejti.' : 'Portfolio coming soon.'}</p></div>
        ) : (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(items ?? []).map((item: any) => (
              <StaggerItem key={item?.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square bg-muted"><Image src={item?.imageUrl ?? ''} alt={lang === 'sq' ? (item?.titleAl ?? '') : (item?.title ?? '')} fill className="object-cover" /></div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{lang === 'sq' ? (item?.titleAl ?? item?.title) : (item?.title ?? '')}</h3>
                    {item?.description && <p className="text-sm text-muted-foreground mt-1">{lang === 'sq' ? (item?.descriptionAl ?? item?.description) : (item?.description ?? '')}</p>}
                    {item?.category && <span className="text-xs text-primary mt-2 inline-block">{item.category}</span>}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}
