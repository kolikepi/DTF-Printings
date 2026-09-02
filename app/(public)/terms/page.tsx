import { pageMetadata } from '@/lib/seo';
import { TERMS } from '@/lib/legal-content';
import LegalClient from '@/app/(public)/_components/legal-client';

export const metadata = pageMetadata({
  title: 'Kushtet e përdorimit — Elev8 Printings',
  description: 'Kushtet për porositë, dizajnet, cilësinë e printimit dhe pagesat te Elev8 Printings.',
  path: '/terms',
});

export default function Page() {
  return <LegalClient doc={TERMS} />;
}
