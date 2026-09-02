import { pageMetadata } from '@/lib/seo';
import MockupDesignerClient from '@/app/(public)/_components/mockup-designer-client';

export const metadata = pageMetadata({
  title: 'Dizajnuesi i mockup-eve — provoje dizajnin mbi produkt',
  description: 'Ngarkoni logon dhe shihni si duket mbi bluzë, hoodie ose polo përpara se ta porosisni.',
  path: '/mockup-designer',
});

export default function Page() {
  return <MockupDesignerClient />;
}
