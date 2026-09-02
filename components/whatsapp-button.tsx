'use client';

import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/components/language-context';
import { whatsappLink } from '@/lib/contact-info';

export function WhatsAppButton() {
  const { lang } = useLanguage();

  // Mesazhi shkon i shkruar, që klienti të mos nisë nga një bisedë bosh.
  const message =
    lang === 'sq'
      ? 'Përshëndetje! Dua të pyes për printim DTF dhe veshje të personalizuara.'
      : 'Hello! I would like to ask about DTF printing and custom apparel.';

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
