'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, SlideIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Upload, Palette, Printer, Truck, Star, ArrowRight, Shirt, ChevronRight } from 'lucide-react';

const CDN = {
  hero: '/images/hero-dtf-press.png',
  tshirt: '/images/custom-tshirt.png',
  hoodie: '/images/custom-hoodie.png',
  dtf: '/images/dtf-transfer-application.png',
  sport: '/images/custom-sportswear.png',
  work: '/images/workwear-branding.png',
  portfolio: '/images/portfolio-gallery.png',
  about: '/images/about-workspace.png',
};

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries?.[0]?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref} className="count-up">{count}{suffix}</span>;
}

export function HomeClient() {
  const { t, lang } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r?.json()).then(d => setCategories(d?.categories ?? [])).catch(() => {});
    fetch('/api/testimonials').then(r => r?.json()).then(d => setTestimonials(d?.testimonials ?? [])).catch(() => {});
    fetch('/api/portfolio').then(r => r?.json()).then(d => setPortfolioItems(d?.items ?? [])).catch(() => {});
  }, []);

  const steps = [
    { icon: Upload, title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
    { icon: Palette, title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
    { icon: Printer, title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
    { icon: Truck, title: t('howItWorks.step4Title'), desc: t('howItWorks.step4Desc') },
  ];

  const categoryImages: Record<string, string> = {
    'tshirts': CDN.tshirt, 'hoodies': CDN.hoodie, 'sportswear': CDN.sport,
    'workwear': CDN.work, 'dtf-transfers': CDN.dtf,
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={CDN.hero} alt="DTF Printing professional workspace" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-20 text-white">
          <FadeIn>
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl opacity-80 mb-8 leading-relaxed">{t('hero.subtitle')}</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/quote"><Button size="lg" className="text-base px-8">{t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
                <Link href="/products"><Button size="lg" variant="secondary" className="text-base px-8">{t('hero.ctaSecondary')}</Button></Link>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: 500, suffix: '+', label: lang === 'sq' ? 'Klientë të kënaqur' : 'Happy Clients' },
                { value: 10000, suffix: '+', label: lang === 'sq' ? 'Produkte të printuara' : 'Products Printed' },
                { value: 3, suffix: '-5 ' + (lang === 'sq' ? 'ditë' : 'days'), label: lang === 'sq' ? 'Dorëzim i shpejtë' : 'Fast Delivery' },
                { value: 1, suffix: ' copë', label: lang === 'sq' ? 'Sasia minimale' : 'Minimum Order' },
              ].map((stat: any, i: number) => (
                <div key={i} className="text-center"><div className="text-2xl md:text-3xl font-bold text-primary"><CountUp end={stat?.value ?? 0} suffix={stat?.suffix ?? ''} /></div><p className="text-sm opacity-70 mt-1">{stat?.label ?? ''}</p></div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="mx-auto max-w-[1200px] px-4">
          <FadeIn><h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">{t('howItWorks.title')}</h2><p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{lang === 'sq' ? 'Procesi ynë i thjeshtë, në 4 hapa' : 'Our simple 4-step process'}</p></FadeIn>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps?.map((step: any, i: number) => {
              const Icon = step?.icon ?? Upload;
              return (<StaggerItem key={i}><Card className="text-center p-6 h-full hover:shadow-lg transition-shadow bg-card"><CardContent className="pt-4"><div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"><Icon className="h-7 w-7 text-primary" /></div><div className="text-sm font-bold text-primary mb-2">{String(i + 1).padStart(2, '0')}</div><h3 className="font-semibold text-lg mb-2">{step?.title ?? ''}</h3><p className="text-sm text-muted-foreground">{step?.desc ?? ''}</p></CardContent></Card></StaggerItem>);
            })}
          </Stagger>
        </div>
      </section>

      {/* Mockup Designer Banner */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <FadeIn>
            <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 md:p-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                    <Palette className="h-3.5 w-3.5" />
                    {lang === 'sq' ? 'I RI!' : 'NEW!'}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3">
                    {lang === 'sq' ? 'Provoni dizajnin tuaj drejtpërdrejt' : 'Preview Your Design Live'}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {lang === 'sq'
                      ? 'Ngarkoni logon ose dizajnin tuaj dhe shihni si duket mbi produkt përpara se ta porosisni. Lëvizeni, ndryshojini madhësinë, rrotullojeni — gjithçka në çast.'
                      : 'Upload your logo or design and see how it will look on the product before you order. Move, resize, rotate — all live!'}
                  </p>
                  <Link href="/mockup-designer">
                    <Button size="lg" className="text-base px-8">
                      {lang === 'sq' ? 'Hap dizajnuesin' : 'Open Designer'} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                  <Image src="/mockups/white_tshirt.png" alt={lang === 'sq' ? 'Dizajnuesi i mockup-eve' : 'Mockup Designer Preview'} fill className="object-contain p-4" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary/90 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg transform -rotate-6">
                      {lang === 'sq' ? 'LOGO JUAJ KËTU' : 'YOUR LOGO HERE'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-4">
          <FadeIn><h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">{t('categories.title')}</h2></FadeIn>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(categories?.length ? categories : [
              { slug: 'tshirts', name: 'Custom T-Shirts', nameAl: 'Bluza të personalizuara' },
              { slug: 'hoodies', name: 'Custom Hoodies', nameAl: 'Hoodie të personalizuara' },
              { slug: 'sportswear', name: 'Sportswear', nameAl: 'Veshje sportive' },
              { slug: 'workwear', name: 'Workwear', nameAl: 'Uniforma pune' },
              { slug: 'dtf-transfers', name: 'DTF Transfers', nameAl: 'Transferta DTF' },
            ])?.map((cat: any) => (
              <StaggerItem key={cat?.slug ?? cat?.id}>
                <Link href={`/products?category=${cat?.slug ?? ''}`}>
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all"><div className="relative aspect-[4/3] bg-muted"><Image src={categoryImages?.[cat?.slug ?? ''] ?? CDN.portfolio} alt={lang === 'sq' ? (cat?.nameAl ?? '') : (cat?.name ?? '')} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-4 left-4 text-white"><h3 className="font-semibold text-lg">{lang === 'sq' ? (cat?.nameAl ?? cat?.name) : (cat?.name ?? '')}</h3><span className="text-sm opacity-80 flex items-center gap-1">{t('common.viewAll')} <ChevronRight className="h-4 w-4" /></span></div></div></Card>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-muted/50">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SlideIn from="left"><div className="relative aspect-video rounded-lg overflow-hidden bg-muted"><Image src={CDN.about} alt="Elev8 Printings workshop" fill className="object-cover" /></div></SlideIn>
            <SlideIn from="right"><div>
              <h2 className="font-display text-3xl font-bold tracking-tight mb-4">{lang === 'sq' ? 'Pse të zgjidhni Elev8 Printings?' : 'Why Choose Elev8 Printings?'}</h2>
              <p className="text-muted-foreground mb-6">{lang === 'sq' ? 'Ne ofrojmë printim DTF profesional me cilësinë më të lartë në Tiranë. Me pajisje profesionale dhe transferta të porosituara nga furnizuesët më të mirë europianë, garantojmë rezultate të shkëlqyera.' : 'We offer professional DTF printing with the highest quality in Tirana. With professional equipment and transfers ordered from the best European suppliers, we guarantee excellent results.'}</p>
              <div className="space-y-3">
                {[lang === 'sq' ? 'Cilësi e lartë e printimit DTF' : 'High quality DTF printing', lang === 'sq' ? 'Minimumi vetëm 1 copë' : 'Minimum order just 1 piece', lang === 'sq' ? 'Dorëzim brenda 3–5 ditësh pune' : 'Delivery within 3-5 business days', lang === 'sq' ? 'Çmime konkurruese' : 'Competitive pricing'].map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Shirt className="h-3 w-3 text-primary" /></div><span className="text-sm">{item}</span></div>
                ))}
              </div>
              <Link href="/services" className="inline-block mt-6"><Button>{lang === 'sq' ? 'Mëso më shumë' : 'Learn More'} <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </div></SlideIn>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      {(portfolioItems?.length ?? 0) > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-[1200px] px-4">
            <FadeIn><h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">{t('featured.title')}</h2></FadeIn>
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(portfolioItems ?? []).slice(0, 6).map((item: any) => (
                <StaggerItem key={item?.id}><Card className="overflow-hidden hover:shadow-lg transition-shadow"><div className="relative aspect-square bg-muted"><Image src={item?.imageUrl ?? CDN.portfolio} alt={lang === 'sq' ? (item?.titleAl ?? '') : (item?.title ?? '')} fill className="object-cover" /></div><CardContent className="p-4"><h3 className="font-semibold">{lang === 'sq' ? (item?.titleAl ?? item?.title) : (item?.title ?? '')}</h3><p className="text-sm text-muted-foreground mt-1">{lang === 'sq' ? (item?.descriptionAl ?? item?.description) : (item?.description ?? '')}</p></CardContent></Card></StaggerItem>
              ))}
            </Stagger>
            <div className="text-center mt-8"><Link href="/portfolio"><Button variant="outline">{t('common.viewAll')} <ArrowRight className="ml-2 h-4 w-4" /></Button></Link></div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {(testimonials?.length ?? 0) > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="mx-auto max-w-[1200px] px-4">
            <FadeIn><h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">{t('testimonials.title')}</h2></FadeIn>
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(testimonials ?? []).slice(0, 3).map((test: any) => (
                <StaggerItem key={test?.id}><Card className="p-6 h-full"><CardContent><div className="flex gap-1 mb-3">{Array.from({ length: test?.rating ?? 5 }).map((_: any, i: number) => (<Star key={i} className="h-4 w-4 fill-primary text-primary" />))}</div><p className="text-sm text-muted-foreground mb-4 italic">&ldquo;{lang === 'sq' ? (test?.textAl ?? test?.text) : (test?.text ?? '')}&rdquo;</p><div><p className="font-semibold text-sm">{test?.name ?? ''}</p>{test?.company && <p className="text-xs text-muted-foreground">{test.company}</p>}</div></CardContent></Card></StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">{t('cta.title')}</h2>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">{t('cta.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/quote"><Button size="lg" variant="secondary" className="text-base px-8">{t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
              <a href="https://wa.me/355692055861" target="_blank" rel="noopener noreferrer"><Button size="lg" className="text-base px-8 bg-[#25D366] hover:bg-[#20BD5A] text-white">WhatsApp</Button></a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
