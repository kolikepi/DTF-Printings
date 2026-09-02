import { pageMetadata } from '@/lib/seo';
import { SHIPPING } from '@/lib/legal-content';
import LegalClient from '@/app/(public)/_components/legal-client';

export const metadata = pageMetadata({
  title: 'Dorëzimi dhe kthimet — Elev8 Printings',
  description: 'Afatet e prodhimit, kostoja e transportit dhe çfarë ndodh me defektet ose anulimet.',
  path: '/shipping-returns',
});

export default function Page() {
  return <LegalClient doc={SHIPPING} />;
}
