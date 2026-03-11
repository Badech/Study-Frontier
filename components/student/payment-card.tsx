'use client';

/**
 * Payment Card Component
 * Sprint 08: Payments and Notifications
 * 
 * Dashboard card showing payment status summary
 */

import { Card } from '@/components/ui/card';
import { DollarSign, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { Payment } from '@/types';

interface PaymentCardProps {
  payments: Payment[];
}

export function PaymentCard({ payments }: PaymentCardProps) {
  const pendingPayments = payments.filter(
    (p) => p.status === 'pending' || p.status === 'invoice_sent'
  );
  const overduePayments = payments.filter((p) => p.status === 'overdue');
  
  const nextPayment = pendingPayments[0];
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-semibold">Payments</h3>
        </div>
        {overduePayments.length > 0 && (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
            {overduePayments.length} Overdue
          </span>
        )}
      </div>

      {payments.length === 0 ? (
        <p className="text-sm text-gray-600">No payments at this time</p>
      ) : (
        <div className="space-y-3">
          {nextPayment && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">
                    Next Payment Due
                  </p>
                  <p className="text-lg font-bold text-yellow-900 mt-1">
                    {nextPayment.currency} {nextPayment.amount.toFixed(2)}
                  </p>
                  {nextPayment.due_date && (
                    <p className="text-xs text-yellow-700 mt-1">
                      Due: {new Date(nextPayment.due_date).toLocaleDateString()}
                    </p>
                  )}
                  {nextPayment.status === 'invoice_sent' && (
                    <p className="text-xs text-yellow-700 mt-1">
                      ✉️ Invoice sent to your email
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {pendingPayments.length > 1 && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{pendingPayments.length}</span> pending
              payments totaling{' '}
              <span className="font-medium">
                {payments[0]?.currency || 'USD'} {totalPending.toFixed(2)}
              </span>
            </div>
          )}

          <Link
            href="/dashboard"
            className="block text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View Payment History →
          </Link>
        </div>
      )}
    </Card>
  );
}
