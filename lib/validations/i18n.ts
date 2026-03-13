/**
 * i18n validation schemas
 * Validates locale parameters and language-related inputs
 */

import { z } from 'zod';
import { locales, defaultLocale } from '@/i18n';

/**
 * Locale validation schema
 * Ensures only valid locales are accepted
 */
export const localeSchema = z.enum(locales, {
  message: `Locale must be one of: ${locales.join(', ')}`,
});

export type LocaleInput = z.infer<typeof localeSchema>;

/**
 * Validate and sanitize locale parameter
 * Returns default locale if invalid
 */
export function validateLocale(locale: unknown): typeof defaultLocale | (typeof locales)[number] {
  const result = localeSchema.safeParse(locale);
  return result.success ? result.data : defaultLocale;
}

/**
 * Language preference schema for user settings
 */
export const languagePreferenceSchema = z.object({
  preferredLocale: localeSchema,
  fallbackLocale: localeSchema.optional(),
});

export type LanguagePreferenceInput = z.infer<typeof languagePreferenceSchema>;
