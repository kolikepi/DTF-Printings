import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';
import { Analytics } from '@/components/analytics';
import { jsonLdScript, localBusinessJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Elev8 Printings | Printim DTF profesional në Tiranë',
  description: 'Printim DTF profesional dhe veshje e personalizuar në Tiranë: bluza, hoodie, veshje sportive dhe uniforma pune me logon tuaj. Cilësi e lartë, minimum i ulët porosie.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Elev8 Printings | Printim DTF profesional në Tiranë',
    description: 'Printim DTF profesional dhe veshje e personalizuar në Tiranë.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(localBusinessJsonLd())} />
        <Providers>
          {children}
          <Toaster />
          <ChunkLoadErrorHandler />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
