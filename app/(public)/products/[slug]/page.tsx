import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { jsonLdScript, pageMetadata, productJsonLd } from '@/lib/seo';
import ProductDetailClient from '@/app/(public)/_components/product-detail-client';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  } catch {
    // Gjatë build-it databaza mund të mos jetë e arritshme; faqja shërbehet gjithsesi.
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params?.slug ?? '');
  if (!product) {
    return pageMetadata({
      title: 'Produkt — Elev8 Printings',
      description: 'Veshje e personalizuar me printim DTF në Tiranë.',
      path: `/products/${params?.slug ?? ''}`,
    });
  }

  const name = product.nameAl ?? product.name;
  return pageMetadata({
    title: `${name} me printim DTF — Elev8 Printings`,
    description: (product.descriptionAl ?? product.description ?? '').slice(0, 300),
    path: `/products/${product.slug}`,
    image: product.imageUrl ?? undefined,
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  const product = await getProduct(params?.slug ?? '');

  return (
    <>
      {product && (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(productJsonLd(product))} />
      )}
      <ProductDetailClient />
    </>
  );
}
