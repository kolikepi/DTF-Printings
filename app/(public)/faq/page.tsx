import { pageMetadata } from '@/lib/seo';
import FAQClient from '@/app/(public)/_components/faq-client';

export const metadata = pageMetadata({
  title: 'Pyetje të shpeshta për printimin DTF',
  description: 'Si funksionon printimi DTF, cilat formate skedarësh pranojmë, sa zgjat dorëzimi dhe sa është sasia minimale e porosisë.',
  path: '/faq',
});

export default function Page() {
  return <FAQClient />;
}
