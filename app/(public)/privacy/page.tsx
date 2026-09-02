import { pageMetadata } from '@/lib/seo';
import { PRIVACY } from '@/lib/legal-content';
import LegalClient from '@/app/(public)/_components/legal-client';

export const metadata = pageMetadata({
  title: 'Politika e privatësisë — Elev8 Printings',
  description: 'Çfarë të dhënash mbledh Elev8 Printings, pse i mbledh dhe si mund t’i kërkoni ose fshini.',
  path: '/privacy',
});

export default function Page() {
  return <LegalClient doc={PRIVACY} />;
}
