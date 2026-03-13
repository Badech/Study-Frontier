'use client';

/**
 * Payment List Component
 * Sprint 08: Payments and Notifications
 * 
 * Admin view of all payments with filtering and status updates
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Payment, PaymentStatus } from '@/types';

interface PaymentWithStudent extends Payment {
  student?: {
    id: string;
    profiles: {
      full_name: string;
      email: string;
    };
  };
  installments?: any[];
}

interface PaymentListProps {
  studentId?: string;
}

export function PaymentList({ studentId }: PaymentListProps) {
  const [payments, setPayments] = useState<PaymentWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [studentId, filter]);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (studentId) params.append('student_id', studentId);
      if (filter !== 'all') params.append('status', filter);

      const response = await fetch(`/api/payments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch payments');

      const result = await response.json();
      setPayments(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    const invoiceId = prompt('Enter PayPal Invoice ID:');
    if (!invoiceId) return;
    
    // Basic validation
    if (invoiceId.trim().length === 0) {
      alert('Invoice ID cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/payments/${paymentId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          external_invoice_id: invoiceId.trim(),
          notes: 'Invoice sent via PayPal',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve payment');
      }

      fetchPayments();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve payment');
    }
  };

  const handleMarkPaid = async (paymentId: string) => {
    const confirmed = confirm('Mark this payment as paid?');
    if (!confirmed) return;
    
    const paymentId_external = prompt('Enter PayPal Payment/Transaction ID (optional):');

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'paid',
          paid_at: new Date().toISOString(),
          external_payment_id: paymentId_external ? paymentId_external.trim() : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to mark payment as paid');
      }

      fetchPayments();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update payment');
    }
  };

  const getStatusColor = (status: PaymentStatus): string => {
    const colors: Record<PaymentStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      invoice_sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      partially_paid: 'bg-orange-100 text-orange-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Loading payments...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'invoice_sent', 'paid', 'overdue'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as PaymentStatus | 'all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          No payments found
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </h3>
                    <StatusBadge
                      status={payment.status}
                      className={getStatusColor(payment.status)}
                    />
                  </div>

                  {!studentId && payment.student && (
                    <p className="text-sm text-gray-600 mb-1">
                      Student: {payment.student.profiles.full_name}
                    </p>
                  )}

                  {payment.package_type && (
                    <p className="text-sm text-gray-600 mb-1">
                      Package: {payment.package_type}
                    </p>
                  )}

                  {payment.description && (
                    <p className="text-sm text-gray-600 mb-1">
                      {payment.description}
                    </p>
                  )}

                  <div className="flex gap-4 text-xs text-gray-500 mt-2">
                    {payment.due_date && (
                      <span>Due: {new Date(payment.due_date).toLocaleDateString()}</span>
                    )}
                    {payment.paid_at && (
                      <span>Paid: {new Date(payment.paid_at).toLocaleDateString()}</span>
                    )}
                    {payment.external_invoice_id && (
                      <span>Invoice: {payment.external_invoice_id}</span>
                    )}
                  </div>

                  {payment.installments && payment.installments.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      {payment.installments.length} installments
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(payment.id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Approve & Send Invoice
                    </button>
                  )}
                  {(payment.status === 'invoice_sent' || payment.status === 'partially_paid') && (
                    <button
                      onClick={() => handleMarkPaid(payment.id)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
