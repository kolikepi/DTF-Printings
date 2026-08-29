'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, Globe, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCartCount } from '@/hooks/use-cart';

export function SiteHeader() {
  const { lang, setLang, t } = useLanguage();
  const { data: session } = useSession() || {};
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartCount();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/services', label: t('nav.services') },
    { href: '/products', label: t('nav.products') },
    { href: '/portfolio', label: t('nav.portfolio') },
    { href: '/pricing', label: t('nav.pricing') },
    { href: '/faq', label: t('nav.faq') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/mockup-designer', label: t('nav.mockupDesigner') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-[1200px] flex items-center justify-between px-4 h-16">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          <span className="text-primary">Elev8</span> Printings
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks?.map((link: any) => (
            <Link key={link?.href} href={link?.href ?? '/'}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
              {link?.label ?? ''}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={() => setLang(lang === 'sq' ? 'en' : 'sq')}
            title={lang === 'sq' ? 'Switch to English' : 'Shqip'}>
            <Globe className="h-4 w-4" />
            <span className="ml-1 text-xs font-medium">{lang === 'sq' ? 'EN' : 'SQ'}</span>
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon-sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {(cartCount ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-1" />
                  {session?.user?.name?.split(' ')?.[0] ?? t('nav.account')}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account"><User className="h-4 w-4 mr-2" />{t('nav.account')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders"><Package className="h-4 w-4 mr-2" />{t('nav.orders')}</Link>
                </DropdownMenuItem>
                {(session?.user as any)?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="h-4 w-4 mr-2" />{t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1">
              <Link href="/login"><Button variant="ghost" size="sm">{t('nav.login')}</Button></Link>
              <Link href="/quote"><Button size="sm">{t('nav.requestQuote')}</Button></Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={() => setLang(lang === 'sq' ? 'en' : 'sq')}>
            <Globe className="h-4 w-4" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon-sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {(cartCount ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks?.map((link: any) => (
              <Link key={link?.href} href={link?.href ?? '/'} onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted">
                {link?.label ?? ''}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2 flex flex-col gap-1">
              {session?.user ? (
                <>
                  <Link href="/account" onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm font-medium">{t('nav.account')}</Link>
                  <Link href="/account/orders" onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm font-medium">{t('nav.orders')}</Link>
                  <button onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false); }}
                    className="px-3 py-2 text-sm font-medium text-left text-destructive">{t('nav.logout')}</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm font-medium">{t('nav.login')}</Link>
                  <Link href="/quote" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full mt-1">{t('nav.requestQuote')}</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
