'use client';

import { useLanguage } from '@/components/language-context';
import { FadeIn } from '@/components/ui/animate';
import type { LegalDoc } from '@/lib/legal-content';

export default function LegalClient({ doc }: { doc: LegalDoc }) {
  const { lang } = useLanguage();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[760px] px-4">
        <FadeIn>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-3">{doc.title[lang]}</h1>
          <p className="text-muted-foreground mb-10">{doc.intro[lang]}</p>

          <div className="space-y-8">
            {doc.sections.map((section) => (
              <section key={section.heading.en}>
                <h2 className="font-semibold text-lg mb-2">{section.heading[lang]}</h2>
                {section.body.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-2">
                    {paragraph[lang]}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-12">
            {lang === 'sq' ? 'Përditësuar së fundi: ' : 'Last updated: '}
            {new Date().toLocaleDateString(lang === 'sq' ? 'sq-AL' : 'en-GB', { year: 'numeric', month: 'long' })}
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
