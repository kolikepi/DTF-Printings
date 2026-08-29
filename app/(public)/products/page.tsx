'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Shirt, Filter } from 'lucide-react';

export default function ProductsPage() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams?.get('category') ?? '';
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(categoryFilter);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories').then(r => r?.json()).then(d => setCategories(d?.categories ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeCategory ? `/api/products?category=${activeCategory}` : '/api/products';
    fetch(url).then(r => r?.json()).then(d => { setProducts(d?.products ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, [activeCategory]);

  useEffect(() => {
    if (categoryFilter) setActiveCategory(categoryFilter);
  }, [categoryFilter]);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold tracking-tight text-center mb-4">{t('nav.products')}</h1>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            {lang === 'sq' ? 'Zgjidhni produktin që dëshironi dhe personalizojeni me dizajnin tuaj.' : 'Choose the product you want and customize it with your design.'}
          </p>
        </FadeIn>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button variant={!activeCategory ? 'default' : 'outline'} size="sm" onClick={() => setActiveCategory('')}>
            <Filter className="h-4 w-4 mr-1" /> {lang === 'sq' ? 'Të gjitha' : 'All'}
          </Button>
          {(categories ?? []).map((cat: any) => (
            <Button key={cat?.id} variant={activeCategory === cat?.slug ? 'default' : 'outline'} size="sm"
              onClick={() => setActiveCategory(cat?.slug ?? '')}>
              {lang === 'sq' ? (cat?.nameAl ?? cat?.name) : (cat?.name ?? '')}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">{t('common.loading')}</div>
        ) : (products?.length ?? 0) === 0 ? (
          <div className="text-center py-20">
            <Shirt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{lang === 'sq' ? 'Asnjë produkt nuk u gjet.' : 'No products found.'}</p>
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(products ?? []).map((product: any) => (
              <StaggerItem key={product?.id}>
                <Link href={`/products/${product?.slug ?? ''}`}>
                  <Card className="overflow-hidden group hover:shadow-lg transition-all cursor-pointer h-full">
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image src={product?.imageUrl ?? '/images/portfolio-gallery.png'} alt={lang === 'sq' ? (product?.nameAl ?? '') : (product?.name ?? '')} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-primary font-medium mb-1">
                        {lang === 'sq' ? (product?.category?.nameAl ?? '') : (product?.category?.name ?? '')}
                      </p>
                      <h3 className="font-semibold text-lg mb-1">
                        {lang === 'sq' ? (product?.nameAl ?? product?.name) : (product?.name ?? '')}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {lang === 'sq' ? (product?.descriptionAl ?? product?.description) : (product?.description ?? '')}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">{product?.basePrice ?? 0} {t('common.lek')}</span>
                        <span className="text-xs text-muted-foreground">min. {product?.minQuantity ?? 1} {lang === 'sq' ? 'copë' : 'pcs'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}
