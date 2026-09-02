import { pageMetadata } from '@/lib/seo';
import ServicesClient from '@/app/(public)/_components/services-client';

export const metadata = pageMetadata({
  title: 'Shërbimet — printim DTF, veshje e personalizuar, porosi me shumicë',
  description: 'Printim DTF, veshje e personalizuar me logon tuaj, printim logosh dhe porosi me shumicë për ekipe, biznese dhe evente në Tiranë.',
  path: '/services',
});

export default function Page() {
  return <ServicesClient />;
}
