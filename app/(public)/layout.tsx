import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppButton } from '@/components/whatsapp-button';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
