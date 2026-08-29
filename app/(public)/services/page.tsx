'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Printer, Shirt, Tag, Package, ArrowRight, Ruler } from 'lucide-react';

const CDN = {
  dtf: '/images/dtf-transfer-application.png',
  tshirt: '/images/custom-tshirt.png',
  hoodie: '/images/custom-hoodie.png',
  sport: '/images/custom-sportswear.png',
  work: '/images/workwear-branding.png',
};

export default function ServicesPage() {
  const { t, lang } = useLanguage();

  const services = [
    { icon: Printer, img: CDN.dtf, title: t('services.dtf.title'), desc: t('services.dtf.desc'), link: '/products?category=dtf-transfers' },
    { icon: Shirt, img: CDN.tshirt, title: t('services.custom.title'), desc: t('services.custom.desc'), link: '/products' },
    { icon: Tag, img: CDN.work, title: t('services.logo.title'), desc: t('services.logo.desc'), link: '/quote' },
    { icon: Package, img: CDN.sport, title: t('services.bulk.title'), desc: t('services.bulk.desc'), link: '/quote' },
  ];

  const printAreas = [
    { name: t('printAreas.leftChest'), size: '9x4cm' },
    { name: t('printAreas.sleeve'), size: '3x8cm' },
    { name: t('printAreas.neck'), size: '4x2.5cm' },
    { name: t('printAreas.frontFull'), size: '22x9cm' },
    { name: t('printAreas.backFull'), size: '30x25cm' },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold tracking-tight text-center mb-4">{t('services.pageTitle')}</h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{t('services.pageDesc')}</p>
        </FadeIn>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services?.map((svc: any, i: number) => {
            const Icon = svc?.icon ?? Printer;
            return (
              <StaggerItem key={i}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="relative aspect-[16/9] bg-muted">
                    <Image src={svc?.img ?? ''} alt={svc?.title ?? ''} fill className="object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-xl">{svc?.title ?? ''}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{svc?.desc ?? ''}</p>
                    <Link href={svc?.link ?? '/'}>
                      <Button variant="outline" size="sm">{t('common.viewAll')} <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Print Areas */}
        <FadeIn>
          <div className="bg-muted/50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Ruler className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {lang === 'sq' ? 'Zonat e printimit' : 'Print Areas'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {printAreas?.map((area: any, i: number) => (
                <Card key={i} className="p-4 text-center">
                  <p className="font-semibold text-sm">{area?.name ?? ''}</p>
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {lang === 'sq' ? 'Kërkesat për skedarin: PNG, sfond transparent, 300 DPI, minimumi 3000×3000 px' : 'File requirements: PNG, transparent background, 300 DPI, minimum 3000x3000px'}
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
