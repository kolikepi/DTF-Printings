'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FadeIn, SlideIn } from '@/components/ui/animate';
import { ShoppingCart, Upload, ArrowLeft, Check, Palette } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProductDetailPage() {
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
    if (!session?.user) {
      router.push('/login');
      return;
    }
    setAdding(true);
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
              <p className="text-3xl font-bold text-primary mb-4">{product?.basePrice ?? 0} {t('common.lek')}</p>
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
                      <Button key={color} variant={selectedColor === color ? 'default' : 'outline'} size="sm" onClick={() => setSelectedColor(color)}>{color}</Button>
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
                      <Button key={area} variant={selectedPrintArea === area ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPrintArea(area)}>{area}</Button>
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
                      <Button variant="outline" size="sm" asChild disabled={uploading}><span>{uploading ? (t('common.loading')) : (lang === 'sq' ? 'Zgjidh Skedarin' : 'Choose File')}</span></Button>
                    </label>
                  </div>
                </Card>
              </div>

              <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={adding}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {adding ? t('common.loading') : t('product.addToCart')}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                {lang === 'sq' ? 'Total: ' : 'Total: '}{(product?.basePrice ?? 0) * quantity} {t('common.lek')}
              </p>

              {/* Mockup Designer CTA */}
              <Link href="/mockup-designer" className="block mt-4">
                <Button variant="outline" size="lg" className="w-full border-primary/30 hover:bg-primary/5">
                  <Palette className="h-5 w-5 mr-2 text-primary" />
                  {lang === 'sq' ? 'Provoje në Dizajnues' : 'Try in Mockup Designer'}
                </Button>
              </Link>
            </div>
          </SlideIn>
        </div>
      </div>
    </div>
  );
}
