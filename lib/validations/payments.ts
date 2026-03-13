/**
 * Payment Validation Schemas
 * Sprint 10: Hardening and Release
 */

import { z } from 'zod';

// ============================================================================
// PAYMENT CREATION
// ============================================================================

export const createPaymentSchema = z.object({
  student_id: z.string().uuid('Invalid student ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)').default('USD'),
  package_type: z.string().max(100).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  due_date: z.string().optional().nullable(),
  payment_provider: z.enum(['paypal', 'stripe', 'other']).default('paypal'),
  installments: z.array(z.object({
    amount: z.number().positive('Installment amount must be positive'),
    description: z.string().max(200).optional().nullable(),
    due_date: z.string(),
  })).optional().nullable(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

// ============================================================================
// PAYMENT UPDATE
// ============================================================================

export const updatePaymentSchema = z.object({
  status: z.enum([
    'pending',
    'invoice_sent',
    'partially_paid',
    'paid',
    'overdue',
    'cancelled',
  ]).optional(),
  amount_paid: z.number().min(0).optional().nullable(),
  payment_date: z.string().optional().nullable(),
  external_transaction_id: z.string().max(200).optional().nullable(),
  admin_notes: z.string().max(1000).optional().nullable(),
  external_invoice_id: z.string().max(200).optional().nullable(),
  external_payment_id: z.string().max(200).optional().nullable(),
  payment_method: z.string().max(100).optional().nullable(),
  paid_at: z.string().optional().nullable(),
});

export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;

// ============================================================================
// PAYMENT APPROVAL
// ============================================================================

export const approvePaymentSchema = z.object({
  external_invoice_id: z.string().max(200).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type ApprovePaymentInput = z.infer<typeof approvePaymentSchema>;

// ============================================================================
// PAYMENT STATUS HELPERS
// ============================================================================

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  invoice_sent: 'Invoice Sent',
  partially_paid: 'Partially Paid',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  invoice_sent: 'bg-blue-100 text-blue-700',
  partially_paid: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
};
