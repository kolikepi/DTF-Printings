import { pageMetadata } from '@/lib/seo';
import ProductsClient from '@/app/(public)/_components/products-client';

export const metadata = pageMetadata({
  title: 'Produkte për personalizim — bluza, hoodie, veshje sportive',
  description: 'Katalogu i Elev8 Printings: bluza, hoodie, sweatshirt, polo, veshje sportive dhe uniforma pune, të personalizuara me printim DTF në Tiranë.',
  path: '/products',
});

export default function Page() {
  return <ProductsClient />;
}
