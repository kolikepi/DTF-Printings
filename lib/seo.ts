import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/contact-info';

/**
 * Metadata dhe të dhëna të strukturuara. Çdo faqe ka titullin, përshkrimin dhe
 * URL-në e vet kanonike — pa këto, motorët e kërkimit shohin të njëjtën faqe kudo.
 */

export function siteUrl() {
  const raw = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  return raw.replace(/\/$/, '');
}

type PageSeo = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export function pageMetadata({ title, description, path, image, noIndex }: PageSeo): Metadata {
  const url = `${siteUrl()}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: BUSINESS.name,
      locale: 'sq_AL',
      type: 'website',
      images: [image ?? '/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image ?? '/og-image.png'],
    },
  };
}

/** Biznesi vetë — kjo e ndihmon të dalë te kërkimet lokale në Tiranë. */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl()}/#business`,
    name: BUSINESS.name,
    description:
      'Printim DTF profesional dhe veshje e personalizuar në Tiranë: bluza, hoodie, veshje sportive dhe uniforma pune me logon tuaj.',
    url: siteUrl(),
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    image: `${siteUrl()}/og-image.png`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address,
      addressLocality: BUSINESS.city,
      addressCountry: 'AL',
    },
    openingHours: BUSINESS.openingHours,
    areaServed: 'Albania',
  };
}

export function productJsonLd(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product?.nameAl ?? product?.name,
    description: product?.descriptionAl ?? product?.description,
    image: product?.imageUrl ? `${siteUrl()}${product.imageUrl}` : `${siteUrl()}/og-image.png`,
    sku: product?.slug,
    brand: { '@type': 'Brand', name: BUSINESS.name },
    offers: {
      '@type': 'Offer',
      price: product?.basePrice ?? 0,
      priceCurrency: 'ALL',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl()}/products/${product?.slug ?? ''}`,
      seller: { '@type': 'Organization', name: BUSINESS.name },
    },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (items ?? []).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Vendoset si <script type="application/ld+json"> te faqja përkatëse. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
