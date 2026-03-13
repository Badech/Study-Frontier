/**
 * CMS Content Validation Schemas
 * Sprint 10: Hardening and Release
 */

import { z } from 'zod';

// ============================================================================
// CMS CONTENT CREATION/UPDATE
// ============================================================================

export const cmsContentSchema = z.object({
  page_slug: z.string().min(1, 'Page slug is required').max(100).regex(
    /^[a-z0-9-_]+$/,
    'Page slug must contain only lowercase letters, numbers, hyphens, and underscores'
  ),
  section_key: z.string().min(1, 'Section key is required').max(100).regex(
    /^[a-z0-9-_]+$/,
    'Section key must contain only lowercase letters, numbers, hyphens, and underscores'
  ),
  locale: z.enum(['en', 'fr', 'ar'], {
    message: 'Locale must be en, fr, or ar',
  }),
  content: z.record(z.string(), z.any()).refine(
    (val) => Object.keys(val).length > 0,
    { message: 'Content cannot be empty' }
  ),
  is_published: z.boolean().default(true),
});

export type CMSContentInput = z.infer<typeof cmsContentSchema>;

// ============================================================================
// CMS DELETE
// ============================================================================

export const deleteCMSContentSchema = z.object({
  id: z.string().uuid('Invalid content ID'),
});

export type DeleteCMSContentInput = z.infer<typeof deleteCMSContentSchema>;
