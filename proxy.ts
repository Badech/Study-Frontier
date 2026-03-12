import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export const proxy = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Use locale prefix for all locales
  localePrefix: 'always',
});

export const config = {
  // Match only marketing pages
  // Skip API routes, _next internals, static files, and app routes (admin, dashboard, etc)
  matcher: [
    '/',
    '/(en|fr|ar)/:path*',
  ],
};
