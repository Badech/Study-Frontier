import { locales, defaultLocale, type Locale } from '@/i18n';

export { locales, defaultLocale };
export type { Locale };

/**
 * Get the locale from the pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  return defaultLocale;
}

/**
 * Check if a locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

/**
 * Get the direction for a locale
 */
export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

/**
 * Get the language name in its native script
 */
export function getLanguageName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    fr: 'Français',
    ar: 'العربية',
  };
  
  return names[locale];
}

/**
 * Format a route with locale prefix
 */
export function localizeRoute(route: string, locale: Locale): string {
  // Remove leading slash if present
  const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
  return `/${locale}/${cleanRoute}`;
}
