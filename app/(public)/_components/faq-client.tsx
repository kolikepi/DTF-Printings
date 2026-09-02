'use client';

import { useLanguage } from '@/components/language-context';
import { FadeIn } from '@/components/ui/animate';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export default function FAQClient() {
  const { t, lang } = useLanguage();

  const faqs = [
    {
      q: { sq: 'Çfarë është printimi DTF?', en: 'What is DTF printing?' },
      a: { sq: 'DTF (Direct-to-Film) është një teknologji printimi ku dizajni printohet në një film special dhe më pas transferohet në veshje me një presë profesionale nxehtësie. Rezultati janë printime me cilësi të lartë, të qëndrueshme dhe me ngjyra të gjalla.', en: 'DTF (Direct-to-Film) is a printing technology where the design is printed on a special film and then transferred to garments using a professional heat press. This results in high-quality, durable prints with vibrant colors.' },
    },
    {
      q: { sq: 'Cilat formate skedarësh pranoni?', en: 'What file formats do you accept?' },
      a: { sq: 'Pranojmë skedarë PNG me sfond transparent, me rezolucion të paktën 300 DPI dhe përmasa të paktën 3000×3000 piksel. Kjo garanton cilësinë më të lartë të printimit.', en: 'We accept PNG files with transparent background, minimum 300 DPI resolution and minimum 3000x3000 pixels. This ensures the highest print quality.' },
    },
    {
      q: { sq: 'Sa kohë zgjat dorëzimi?', en: 'How long does delivery take?' },
      a: { sq: 'Koha e zakonshme e dorëzimit është 3–5 ditë pune pas konfirmimit të porosisë. Për porosi urgjente, na kontaktoni për mundësi më të shpejta.', en: 'Normal delivery time is 3-5 business days after order confirmation. For urgent orders, contact us for faster options.' },
    },
    {
      q: { sq: 'Cila është sasia minimale e porosisë?', en: 'What is the minimum order quantity?' },
      a: { sq: 'Sasia minimale e porosisë është vetëm 1 copë! Pranojmë porosi të çdo sasie, nga një copë e vetme deri te porositë e mëdha për ekipe dhe kompani.', en: 'The minimum order quantity is just 1 piece! We accept orders of any size, from 1 piece to large orders for teams and companies.' },
    },
    {
      q: { sq: 'A mund të porosis për ekipin ose kompaninë time?', en: 'Can I order for my team/company?' },
      a: { sq: 'Patjetër! Ofrojmë çmime speciale për porosi me shumicë. Na kontaktoni për një ofertë të personalizuar për ekipin ose kompaninë tuaj.', en: 'Absolutely! We offer special pricing for bulk orders. Contact us for a custom quote for your team or company.' },
    },
    {
      q: { sq: 'Cilat veshje mund të printoni?', en: 'What garments can you print on?' },
      a: { sq: 'Mund të printojmë në pothuajse çdo lloj veshjeje: bluza, hoodie, sweatshirt, polo, veshje sportive, uniforma pune, xhaketa e më shumë.', en: 'We can print on almost any garment type: t-shirts, hoodies, sweatshirts, polo shirts, sportswear, workwear, jackets and more.' },
    },
    {
      q: { sq: 'Si të paguaj?', en: 'How can I pay?' },
      a: { sq: 'Për momentin pranojmë pagesë me para në dorë (në dorëzim) ose me transfertë bankare. Pagesën online do ta shtojmë së shpejti.', en: 'Currently we accept cash on delivery or bank transfer. Online payment will be added soon.' },
    },
    {
      q: { sq: 'A mund të bëj një porosi prove?', en: 'Can I place a sample order?' },
      a: { sq: 'Po! Meqenëse sasia minimale është 1 copë, mund të porosisni një copë prove përpara se të bëni një porosi më të madhe.', en: 'Yes! Since our minimum order is 1 piece, you can order a sample piece before placing a larger order.' },
    },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[800px] px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <HelpCircle className="h-10 w-10 text-primary mx-auto mb-4" />
            <h1 className="font-display text-4xl font-bold tracking-tight mb-4">{t('faq.pageTitle')}</h1>
            <p className="text-muted-foreground">{t('faq.pageDesc')}</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs?.map((faq: any, i: number) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-lg border px-4">
                <AccordionTrigger className="text-left font-medium">{lang === 'sq' ? (faq?.q?.sq ?? '') : (faq?.q?.en ?? '')}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{lang === 'sq' ? (faq?.a?.sq ?? '') : (faq?.a?.en ?? '')}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </div>
  );
}
