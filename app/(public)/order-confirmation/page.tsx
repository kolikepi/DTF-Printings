'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/animate';
import { CheckCircle, Package, Home } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get('order') ?? '';

  return (
    <div className="py-20">
      <div className="mx-auto max-w-md px-4 text-center">
        <FadeIn>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
            {lang === 'sq' ? 'Porosia u Bë me Sukses!' : 'Order Placed Successfully!'}
          </h1>
          {orderNumber && (
            <p className="text-lg text-muted-foreground mb-2">
              {lang === 'sq' ? 'Numri i porosie:' : 'Order number:'} <strong className="text-foreground">{orderNumber}</strong>
            </p>
          )}
          <p className="text-muted-foreground mb-8">
            {lang === 'sq' ? 'Do tju kontaktojmë për konfirmimin e porosie. Faleminderit!' : 'We will contact you for order confirmation. Thank you!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account/orders"><Button variant="outline"><Package className="h-4 w-4 mr-2" />{lang === 'sq' ? 'Shiko Porositë' : 'View Orders'}</Button></Link>
            <Link href="/"><Button><Home className="h-4 w-4 mr-2" />{lang === 'sq' ? 'Kryefaqja' : 'Home'}</Button></Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
