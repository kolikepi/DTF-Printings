'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/language-context';
import { formatPrice } from '@/lib/pricing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Shirt, Filter, Search } from 'lucide-react';

export default function ProductsClient() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams?.get('category') ?? '';
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(categoryFilter);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
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

  // Kërkimi dhe renditja bëhen te browser-i: katalogu është i vogël dhe përgjigjja e menjëhershme.
  const visibleProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = (products ?? []).filter((product: any) => {
      if (!needle) return true;
      return [product?.name, product?.nameAl, product?.description, product?.descriptionAl, product?.category?.name, product?.category?.nameAl]
        .filter(Boolean)
        .some((field: string) => field.toLowerCase().includes(needle));
    });

    const sorted = [...filtered];
    if (sort === 'price-asc') sorted.sort((a: any, b: any) => (a?.basePrice ?? 0) - (b?.basePrice ?? 0));
    if (sort === 'price-desc') sorted.sort((a: any, b: any) => (b?.basePrice ?? 0) - (a?.basePrice ?? 0));
    if (sort === 'name') {
      sorted.sort((a: any, b: any) =>
        String(lang === 'sq' ? (a?.nameAl ?? a?.name) : a?.name).localeCompare(String(lang === 'sq' ? (b?.nameAl ?? b?.name) : b?.name), 'sq'),
      );
    }
    return sorted;
  }, [products, query, sort, lang]);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold tracking-tight text-center mb-4">{t('nav.products')}</h1>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            {lang === 'sq' ? 'Zgjidhni produktin që dëshironi dhe personalizojeni me dizajnin tuaj.' : 'Choose the product you want and customize it with your design.'}
          </p>
        </FadeIn>

        {/* Kërkim dhe renditje */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e: any) => setQuery(e?.target?.value ?? '')}
              placeholder={lang === 'sq' ? 'Kërko produkt…' : 'Search products…'}
              className="pl-10"
              aria-label={lang === 'sq' ? 'Kërko produkt' : 'Search products'}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label={lang === 'sq' ? 'Renditja' : 'Sorting'}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm sm:w-56"
          >
            <option value="featured">{lang === 'sq' ? 'Renditja e parazgjedhur' : 'Default order'}</option>
            <option value="price-asc">{lang === 'sq' ? 'Çmimi: nga më i liri' : 'Price: low to high'}</option>
            <option value="price-desc">{lang === 'sq' ? 'Çmimi: nga më i shtrenjti' : 'Price: high to low'}</option>
            <option value="name">{lang === 'sq' ? 'Sipas emrit' : 'By name'}</option>
          </select>
        </div>

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
        ) : (visibleProducts?.length ?? 0) === 0 ? (
          <div className="text-center py-20">
            <Shirt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {query
                ? (lang === 'sq' ? `Asnjë produkt për “${query}”.` : `No products for “${query}”.`)
                : (lang === 'sq' ? 'Asnjë produkt nuk u gjet.' : 'No products found.')}
            </p>
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(visibleProducts ?? []).map((product: any) => (
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
                        <span className="font-bold text-lg">{formatPrice(product?.basePrice, lang)}</span>
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
