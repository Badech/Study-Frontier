"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navigation');
  const locale = useLocale();

  const navLinks = [
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/study-usa`, label: t('studyUsa') },
    { href: `/${locale}/process`, label: t('process') },
    { href: `/${locale}/institutions`, label: t('institutions') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="text-xl font-bold">
            Study Frontier
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t('login')}
            </Link>
            <Button asChild size="sm" variant="outline">
              <Link href={`/${locale}/assessment`}>{t('getAssessed')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-border py-4 md:hidden" id="mobile-menu">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-4">
                <LanguageSwitcher />
              </div>
              <Link
                href={`/${locale}/login`}
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {t('login')}
              </Link>
              <Button asChild size="sm" className="w-full" variant="outline">
                <Link href={`/${locale}/assessment`} onClick={() => setIsOpen(false)}>
                  {t('getAssessed')}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
