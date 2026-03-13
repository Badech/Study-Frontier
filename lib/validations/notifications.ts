/**
 * Notification Validation Schemas
 * Sprint 10: Hardening and Release
 */

import { z } from 'zod';

// ============================================================================
// MARK NOTIFICATION AS READ
// ============================================================================

export const markNotificationReadSchema = z.object({
  notification_id: z.string().uuid('Invalid notification ID').optional(),
  mark_all: z.boolean().optional(),
}).refine(
  (data) => data.notification_id !== undefined || data.mark_all === true,
  'Either notification_id or mark_all must be provided'
);

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>;
