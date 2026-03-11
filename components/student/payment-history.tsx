'use client';

/**
 * Payment History Component
 * Sprint 08: Payments and Notifications
 * 
 * Student view of payment status and history
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { Payment, PaymentInstallment } from '@/types';

interface PaymentWithInstallments extends Payment {
  installments?: PaymentInstallment[];
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<PaymentWithInstallments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments');
      if (!response.ok) throw new Error('Failed to fetch payments');

      const result = await response.json();
      setPayments(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
      case 'invoice_sent':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      invoice_sent: 'Invoice Sent',
      paid: 'Paid',
      partially_paid: 'Partially Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading payment history...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-600">{error}</div>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No payment history yet</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment History</h2>

      {payments.map((payment) => (
        <Card key={payment.id} className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {getStatusIcon(payment.status)}
              <div>
                <h3 className="font-semibold text-lg">
                  {payment.currency} {payment.amount.toFixed(2)}
                </h3>
                {payment.package_type && (
                  <p className="text-sm text-gray-600 capitalize">
                    {payment.package_type.replace('_', ' ')} Package
                  </p>
                )}
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                payment.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : payment.status === 'overdue'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {getStatusText(payment.status)}
            </span>
          </div>

          {payment.description && (
            <p className="text-sm text-gray-700 mb-3">{payment.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            {payment.due_date && (
              <div>
                <span className="text-gray-500">Due Date:</span>
                <p className="font-medium">
                  {new Date(payment.due_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {payment.paid_at && (
              <div>
                <span className="text-gray-500">Paid On:</span>
                <p className="font-medium">
                  {new Date(payment.paid_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Installments */}
          {payment.installments && payment.installments.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-semibold mb-2">Installment Plan</h4>
              <div className="space-y-2">
                {payment.installments.map((inst) => (
                  <div
                    key={inst.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {inst.status === 'paid' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : inst.status === 'overdue' ? (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                      <span>
                        {inst.description || `Installment ${inst.installment_number}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {payment.currency} {inst.amount.toFixed(2)}
                      </span>
                      <span className="text-gray-500">
                        Due: {new Date(inst.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {payment.status === 'invoice_sent' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
              <p className="text-blue-800">
                📧 An invoice has been sent to your email. Please check your inbox
                and follow the payment instructions.
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
