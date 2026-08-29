'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/animate';
import { LogIn, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.ok) {
        router.replace('/');
      } else {
        toast.error(t('common.error'));
      }
    } catch {
      toast.error(t('common.error'));
    }
    setLoading(false);
  };

  return (
    <div className="py-20">
      <div className="mx-auto max-w-md px-4">
        <FadeIn>
          <Card className="p-6">
            <CardContent>
              <div className="text-center mb-6">
                <LogIn className="h-10 w-10 text-primary mx-auto mb-3" />
                <h1 className="font-display text-2xl font-bold">{t('login.title')}</h1>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('contact.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="email" value={email} onChange={(e: any) => setEmail(e?.target?.value ?? '')} required className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('signup.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" value={password} onChange={(e: any) => setPassword(e?.target?.value ?? '')} required className="pl-10" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('common.loading') : t('nav.login')}
                </Button>
              </form>
              <p className="text-sm text-center mt-4 text-muted-foreground">
                {t('login.noAccount')} <Link href="/signup" className="text-primary hover:underline">{t('nav.signup')}</Link>
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
