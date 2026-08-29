'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Shirt, Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const { t, lang } = useLanguage();

  const plans = [
    {
      name: lang === 'sq' ? 'Bluzë' : 'T-Shirt',
      price: 1500,
      features: [
        lang === 'sq' ? 'Bluzë cilësore' : 'Quality t-shirt',
        lang === 'sq' ? 'Printim DTF në 1 zonë' : 'DTF print 1 area',
        lang === 'sq' ? 'Nga 1 copë' : 'From 1 piece',
        lang === 'sq' ? 'Ngjyra të ndryshme' : 'Various colors',
      ],
    },
    {
      name: lang === 'sq' ? 'Hoodie' : 'Hoodie',
      price: 3000,
      popular: true,
      features: [
        lang === 'sq' ? 'Hoodie premium' : 'Premium hoodie',
        lang === 'sq' ? 'Printim DTF deri në 2 zona' : 'DTF print up to 2 areas',
        lang === 'sq' ? 'Nga 1 copë' : 'From 1 piece',
        lang === 'sq' ? 'S-3XL' : 'S-3XL',
      ],
    },
    {
      name: lang === 'sq' ? 'Polo' : 'Polo Shirt',
      price: 2000,
      features: [
        lang === 'sq' ? 'Polo cilësore' : 'Quality polo shirt',
        lang === 'sq' ? 'Printim logoje në gjoks' : 'Chest logo print',
        lang === 'sq' ? 'Ideale për kompani' : 'Ideal for companies',
        lang === 'sq' ? 'Ngjyra të ndryshme' : 'Various colors',
      ],
    },
    {
      name: lang === 'sq' ? 'Veshje sportive' : 'Sportswear',
      price: 2500,
      features: [
        lang === 'sq' ? 'Fanellë ose uniformë sportive' : 'Sports jersey/uniform',
        lang === 'sq' ? 'Printim emri dhe numri' : 'Name and number printing',
        lang === 'sq' ? 'Materiale të lehta' : 'Lightweight materials',
        lang === 'sq' ? 'Porosi ekipi' : 'Team orders',
      ],
    },
    {
      name: lang === 'sq' ? 'Sweatshirt' : 'Sweatshirt',
      price: 2500,
      features: [
        lang === 'sq' ? 'Sweatshirt cilësor' : 'Quality sweatshirt',
        lang === 'sq' ? 'Printim DTF deri në 2 zona' : 'DTF print up to 2 areas',
        lang === 'sq' ? 'Nga 1 copë' : 'From 1 piece',
        lang === 'sq' ? 'S-3XL' : 'S-3XL',
      ],
    },
    {
      name: lang === 'sq' ? 'Uniforma pune' : 'Workwear',
      price: 2000,
      features: [
        lang === 'sq' ? 'Uniformë ose veshje pune' : 'Work uniform',
        lang === 'sq' ? 'Logo kompanie' : 'Company logo',
        lang === 'sq' ? 'Materiale rezistente' : 'Durable materials',
        lang === 'sq' ? 'Çmime speciale për sasi' : 'Volume discounts',
      ],
    },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold tracking-tight text-center mb-4">{t('pricing.pageTitle')}</h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{t('pricing.pageDesc')}</p>
        </FadeIn>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan: any, i: number) => (
            <StaggerItem key={i}>
              <Card className={`h-full hover:shadow-lg transition-shadow ${plan?.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
                {plan?.popular && <div className="bg-primary text-primary-foreground text-center py-1 text-xs font-bold">{lang === 'sq' ? 'Më i kërkuari' : 'Most Popular'}</div>}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shirt className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{plan?.name ?? ''}</CardTitle>
                  </div>
                  <div className="mt-2"><span className="text-sm text-muted-foreground">{t('pricing.from')}</span>
                    <span className="text-3xl font-bold ml-1">{plan?.price ?? 0}</span>
                    <span className="text-sm text-muted-foreground ml-1">{t('common.lek')} {t('pricing.perUnit')}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {(plan?.features ?? []).map((f: string, j: number) => (
                      <li key={j} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary flex-shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Link href="/quote">
                    <Button className="w-full" variant={plan?.popular ? 'default' : 'outline'}>
                      {t('nav.requestQuote')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn>
          <div className="mt-12 text-center bg-muted/50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-2">{lang === 'sq' ? 'Çmime speciale për sasi' : 'Volume Discounts'}</h3>
            <p className="text-muted-foreground mb-4">{lang === 'sq' ? 'Për porosi mbi 10 copë, na kontaktoni për çmime speciale.' : 'For orders over 10 pieces, contact us for special pricing.'}</p>
            <Link href="/quote"><Button>{t('nav.requestQuote')}</Button></Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
