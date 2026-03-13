/**
 * Payment validation helpers
 * Additional validation utilities for payment operations
 */

import { z } from 'zod';

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate payment amount
 */
export function isValidPaymentAmount(amount: number): boolean {
  return !isNaN(amount) && amount > 0 && amount <= 999999.99;
}

/**
 * Validate currency code (ISO 4217)
 */
export function isValidCurrency(currency: string): boolean {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'MAD', 'CAD', 'AUD'];
  return validCurrencies.includes(currency.toUpperCase());
}

/**
 * Validate installments sum to total
 */
export function validateInstallments(
  totalAmount: number,
  installments: Array<{ amount: number }>
): { valid: boolean; error?: string } {
  if (!installments || installments.length === 0) {
    return { valid: true };
  }

  const sum = installments.reduce((acc, inst) => acc + inst.amount, 0);
  const difference = Math.abs(sum - totalAmount);

  if (difference > 0.01) {
    return {
      valid: false,
      error: `Installments sum to ${sum.toFixed(2)}, but total is ${totalAmount.toFixed(2)}`,
    };
  }

  return { valid: true };
}

/**
 * Payment status machine - validate status transitions
 */
export function isValidStatusTransition(
  currentStatus: string,
  newStatus: string
): boolean {
  const validTransitions: Record<string, string[]> = {
    pending: ['invoice_sent', 'cancelled'],
    invoice_sent: ['paid', 'partially_paid', 'overdue', 'cancelled'],
    partially_paid: ['paid', 'overdue', 'cancelled'],
    paid: ['refunded'],
    overdue: ['paid', 'partially_paid', 'cancelled'],
    cancelled: [],
    refunded: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Sanitize payment description
 */
export function sanitizePaymentDescription(description: string): string {
  return description
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .substring(0, 500); // Enforce max length
}
