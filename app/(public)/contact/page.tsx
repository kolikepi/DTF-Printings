import { pageMetadata } from '@/lib/seo';
import ContactClient from '@/app/(public)/_components/contact-client';

export const metadata = pageMetadata({
  title: 'Kontakt — Elev8 Printings, Tiranë',
  description: 'Na shkruani për printim DTF dhe veshje të personalizuara në Tiranë. Përgjigjemi brenda një dite pune.',
  path: '/contact',
});

export default function Page() {
  return <ContactClient />;
}
