'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/language-context';
import { colorLabel, printAreaLabel } from '@/lib/catalog-labels';
import { QUANTITY_TIERS, discountFor, formatPrice, lineTotal, unitPriceFor } from '@/lib/pricing';
import { addToGuestCart } from '@/lib/guest-cart';
import { whatsappLink } from '@/lib/contact-info';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FadeIn, SlideIn } from '@/components/ui/animate';
import { ShoppingCart, Upload, ArrowLeft, Check, Palette, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProductDetailClient() {
  const { t, lang } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedPrintArea, setSelectedPrintArea] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [designCloudPath, setDesignCloudPath] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!params?.slug) return;
    fetch(`/api/products/${params.slug}`)
      .then(r => r?.json())
      .then(d => {
        setProduct(d?.product ?? null);
        if (d?.product?.sizes?.[0]) setSelectedSize(d.product.sizes[0]);
        if (d?.product?.colors?.[0]) setSelectedColor(d.product.colors[0]);
        if (d?.product?.printAreas?.[0]) setSelectedPrintArea(d.product.printAreas[0]);
        setQuantity(d?.product?.minQuantity ?? 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params?.slug]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, fileSize: file.size, isPublic: false }),
      });
      const data = await res?.json();
      if (!data?.uploadUrl) throw new Error('No upload URL');

      const signedHeaders = new URL(data.uploadUrl).searchParams?.get('X-Amz-SignedHeaders') ?? '';
      const headers: Record<string, string> = { 'Content-Type': file.type };
      if (signedHeaders?.includes('content-disposition')) {
        headers['Content-Disposition'] = 'attachment';
      }

      await fetch(data.uploadUrl, { method: 'PUT', headers, body: file });
      setDesignCloudPath(data?.cloud_storage_path ?? '');
      toast.success(lang === 'sq' ? 'Dizajni u ngarkua!' : 'Design uploaded!');
    } catch {
      toast.error(t('common.error'));
    }
    setUploading(false);
  };

  const handleAddToCart = async () => {
    setAdding(true);

    // Vizitori pa llogari e mban shportën te browser-i; nuk e detyrojmë të regjistrohet.
    if (!session?.user) {
      addToGuestCart({
        productId: product?.id,
        slug: product?.slug,
        name: product?.name,
        nameAl: product?.nameAl ?? null,
        imageUrl: product?.imageUrl ?? null,
        basePrice: product?.basePrice ?? 0,
        quantity,
        size: selectedSize || null,
        color: selectedColor || null,
        printArea: selectedPrintArea || null,
        designCloudPath: designCloudPath || null,
        designIsPublic: false,
        notes: null,
      });
      toast.success(lang === 'sq' ? 'U shtua në shportë!' : 'Added to cart!');
      setAdding(false);
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id,
          quantity,
          size: selectedSize || null,
          color: selectedColor || null,
          printArea: selectedPrintArea || null,
          designCloudPath: designCloudPath || null,
          designIsPublic: false,
        }),
      });
      if (res?.ok) {
        toast.success(lang === 'sq' ? 'U shtua në shportë!' : 'Added to cart!');
      } else {
        toast.error(t('common.error'));
      }
    } catch {
      toast.error(t('common.error'));
    }
    setAdding(false);
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground">{t('common.loading')}</div>;
  if (!product) return <div className="py-20 text-center text-muted-foreground">{lang === 'sq' ? 'Produkti nuk u gjet.' : 'Product not found.'}</div>;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> {t('common.back')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SlideIn from="left">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image src={product?.imageUrl ?? '/images/portfolio-gallery.png'} alt={lang === 'sq' ? (product?.nameAl ?? '') : (product?.name ?? '')} fill className="object-cover" />
            </div>
          </SlideIn>

          <SlideIn from="right">
            <div>
              <p className="text-sm text-primary font-medium mb-2">{lang === 'sq' ? (product?.category?.nameAl ?? '') : (product?.category?.name ?? '')}</p>
              <h1 className="font-display text-3xl font-bold tracking-tight mb-2">{lang === 'sq' ? (product?.nameAl ?? product?.name) : (product?.name ?? '')}</h1>
              <div className="mb-4">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(unitPriceFor(product?.basePrice ?? 0, quantity), lang)}
                  <span className="text-base font-normal text-muted-foreground"> / {lang === 'sq' ? 'copë' : 'pc'}</span>
                </p>
                {discountFor(quantity) > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="line-through">{formatPrice(product?.basePrice ?? 0, lang)}</span>{' '}
                    <span className="text-primary font-medium">
                      −{Math.round(discountFor(quantity) * 100)}% {lang === 'sq' ? 'për këtë sasi' : 'at this quantity'}
                    </span>
                  </p>
                )}
              </div>
              <p className="text-muted-foreground mb-6">{lang === 'sq' ? (product?.descriptionAl ?? product?.description) : (product?.description ?? '')}</p>

              {/* Size */}
              {(product?.sizes?.length ?? 0) > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">{t('product.size')}</label>
                  <div className="flex flex-wrap gap-2">
                    {(product?.sizes ?? []).map((size: string) => (
                      <Button key={size} variant={selectedSize === size ? 'default' : 'outline'} size="sm" onClick={() => setSelectedSize(size)}>{size}</Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color */}
              {(product?.colors?.length ?? 0) > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">{t('product.color')}</label>
                  <div className="flex flex-wrap gap-2">
                    {(product?.colors ?? []).map((color: string) => (
                      <Button key={color} variant={selectedColor === color ? 'default' : 'outline'} size="sm" onClick={() => setSelectedColor(color)}>{colorLabel(color, lang)}</Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Print Area */}
              {(product?.printAreas?.length ?? 0) > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">{t('product.printArea')}</label>
                  <div className="flex flex-wrap gap-2">
                    {(product?.printAreas ?? []).map((area: string) => (
                      <Button key={area} variant={selectedPrintArea === area ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPrintArea(area)}>{printAreaLabel(area, lang)}</Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">{t('product.quantity')} ({t('product.minOrder')}: {product?.minQuantity ?? 1})</label>
                <input type="number" min={product?.minQuantity ?? 1} value={quantity}
                  onChange={(e: any) => setQuantity(Math.max(product?.minQuantity ?? 1, parseInt(e?.target?.value) || 1))}
                  className="w-24 border border-input rounded-md px-3 py-2 text-sm" />
                <div className="flex flex-wrap gap-2 mt-3">
                  {[...QUANTITY_TIERS].reverse().map((tier) => (
                    <button
                      key={tier.min}
                      type="button"
                      onClick={() => setQuantity(tier.min)}
                      className={`text-xs rounded-full border px-3 py-1.5 transition-colors ${
                        quantity >= tier.min ? 'border-primary text-primary bg-primary/5' : 'border-input text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tier.min}+ {lang === 'sq' ? 'copë' : 'pcs'} · −{Math.round(tier.discount * 100)}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Design */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">{t('product.uploadDesign')}</label>
                <Card className="p-4 border-dashed">
                  <div className="text-center">
                    {designCloudPath ? (
                      <div className="flex items-center gap-2 justify-center text-green-600"><Check className="h-5 w-5" /><span className="text-sm">{lang === 'sq' ? 'Dizajni u ngarkua' : 'Design uploaded'}</span></div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">PNG, {lang === 'sq' ? 'sfond transparent' : 'transparent background'}, 300 DPI</p>
                      </>
                    )}
                    <input type="file" accept=".png,.jpg,.jpeg" onChange={handleUpload} className="hidden" id="design-upload" />
                    <label htmlFor="design-upload">
                      <Button variant="outline" size="sm" asChild disabled={uploading}><span>{uploading ? (t('common.loading')) : (lang === 'sq' ? 'Zgjidh skedarin' : 'Choose File')}</span></Button>
                    </label>
                  </div>
                </Card>
              </div>

              <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={adding}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {adding ? t('common.loading') : t('product.addToCart')}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full mt-3"
                asChild
              >
                <a
                  href={whatsappLink(
                    lang === 'sq'
                      ? `Përshëndetje! Interesohem për ${product?.nameAl ?? product?.name} (${quantity} copë, ${formatPrice(lineTotal(product?.basePrice ?? 0, quantity), 'sq')}).`
                      : `Hello! I'm interested in ${product?.name} (${quantity} pcs, ${formatPrice(lineTotal(product?.basePrice ?? 0, quantity), 'en')}).`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {lang === 'sq' ? 'Porosit në WhatsApp' : 'Order on WhatsApp'}
                </a>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                {lang === 'sq' ? 'Total: ' : 'Total: '}{formatPrice(lineTotal(product?.basePrice ?? 0, quantity), lang)}
              </p>

              {/* Mockup Designer CTA */}
              <Link href="/mockup-designer" className="block mt-4">
                <Button variant="outline" size="lg" className="w-full border-primary/30 hover:bg-primary/5">
                  <Palette className="h-5 w-5 mr-2 text-primary" />
                  {lang === 'sq' ? 'Provoje te dizajnuesi' : 'Try in Mockup Designer'}
                </Button>
              </Link>
            </div>
          </SlideIn>
        </div>
      </div>
    </div>
  );
}
