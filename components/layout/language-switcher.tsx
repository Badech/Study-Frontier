"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { locales, type Locale } from '@/i18n';

const languageNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Remove current locale from pathname and add new locale
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{languageNames[locale]}</span>
      </button>
      
      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 hidden w-32 rounded-lg border border-border bg-background py-1 shadow-lg group-hover:block">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-muted ${
              loc === locale ? 'font-semibold text-primary' : ''
            }`}
          >
            {languageNames[loc]}
          </button>
        ))}
      </div>
    </div>
  );
}
