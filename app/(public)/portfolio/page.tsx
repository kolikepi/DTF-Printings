import { pageMetadata } from '@/lib/seo';
import PortfolioClient from '@/app/(public)/_components/portfolio-client';

export const metadata = pageMetadata({
  title: 'Portofoli — punë të realizuara me printim DTF',
  description: 'Bluza për palestra, komplete ekipesh, uniforma restorantesh dhe koleksione markash, të printuara nga Elev8 Printings në Tiranë.',
  path: '/portfolio',
});

export default function Page() {
  return <PortfolioClient />;
}
