import { pageMetadata } from '@/lib/seo';
import PricingClient from '@/app/(public)/_components/pricing-client';

export const metadata = pageMetadata({
  title: 'Çmimet e printimit DTF dhe veshjeve të personalizuara',
  description: 'Çmime transparente për bluza, hoodie, polo dhe transferta DTF. Zbritje sipas sasisë dhe transport falas mbi 5.000 Lekë.',
  path: '/pricing',
});

export default function Page() {
  return <PricingClient />;
}
