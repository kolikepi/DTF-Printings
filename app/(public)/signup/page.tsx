'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/animate';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error(t('common.error'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res?.ok) {
        await signIn('credentials', { email: form.email, password: form.password, redirect: true, callbackUrl: '/' });
      } else {
        toast.error(data?.error ?? t('common.error'));
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
                <UserPlus className="h-10 w-10 text-primary mx-auto mb-3" />
                <h1 className="font-display text-2xl font-bold">{t('signup.title')}</h1>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('signup.name')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={form.name} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), name: e?.target?.value ?? '' }))} required className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('contact.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="email" value={form.email} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), email: e?.target?.value ?? '' }))} required className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('signup.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" value={form.password} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), password: e?.target?.value ?? '' }))} required minLength={6} className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('signup.confirmPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" value={form.confirmPassword} onChange={(e: any) => setForm(p => ({ ...(p ?? {}), confirmPassword: e?.target?.value ?? '' }))} required minLength={6} className="pl-10" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('common.loading') : t('nav.signup')}
                </Button>
              </form>
              <p className="text-sm text-center mt-4 text-muted-foreground">
                {t('signup.hasAccount')} <Link href="/login" className="text-primary hover:underline">{t('nav.login')}</Link>
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
