import { pageMetadata } from '@/lib/seo';
import QuoteClient from '@/app/(public)/_components/quote-client';

export const metadata = pageMetadata({
  title: 'Kërko ofertë për printim DTF',
  description: 'Dërgoni dizajnin dhe sasinë dhe merrni një ofertë të personalizuar brenda 24 orësh.',
  path: '/quote',
});

export default function Page() {
  return <QuoteClient />;
}
