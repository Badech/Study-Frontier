'use client';

/**
 * Payment Request Form Component
 * Sprint 08: Payments and Notifications
 * 
 * Admin form to create payment requests for students
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PaymentRequestFormProps {
  studentId: string;
  studentName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Installment {
  amount: number;
  description: string;
  due_date: string;
}

export function PaymentRequestForm({
  studentId,
  studentName,
  onSuccess,
  onCancel,
}: PaymentRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    package_type: '',
    description: '',
    due_date: '',
    payment_provider: 'paypal',
  });

  const [useInstallments, setUseInstallments] = useState(false);
  const [installments, setInstallments] = useState<Installment[]>([
    { amount: 0, description: 'First installment', due_date: '' },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate amount
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Amount must be a positive number');
      }
      
      // Validate installments if enabled
      if (useInstallments) {
        const totalInstallments = installments.reduce((sum, inst) => sum + inst.amount, 0);
        if (Math.abs(totalInstallments - amount) > 0.01) {
          throw new Error('Installment amounts must sum to the total amount');
        }
        
        const hasEmptyDates = installments.some(inst => !inst.due_date);
        if (hasEmptyDates) {
          throw new Error('All installments must have due dates');
        }
      }

      const payload = {
        student_id: studentId,
        amount,
        currency: formData.currency,
        package_type: formData.package_type || null,
        description: formData.description || null,
        due_date: formData.due_date || null,
        payment_provider: formData.payment_provider,
        ...(useInstallments && { installments }),
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create payment request');
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addInstallment = () => {
    setInstallments([
      ...installments,
      {
        amount: 0,
        description: `Installment ${installments.length + 1}`,
        due_date: '',
      },
    ]);
  };

  const removeInstallment = (index: number) => {
    setInstallments(installments.filter((_, i) => i !== index));
  };

  const updateInstallment = (index: number, field: keyof Installment, value: any) => {
    const updated = [...installments];
    updated[index] = { ...updated[index], [field]: value };
    setInstallments(updated);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Create Payment Request for {studentName}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0.00"
              aria-label="Payment amount"
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="USD">USD</option>
              <option value="MAD">MAD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Package Type</label>
            <select
              value={formData.package_type}
              onChange={(e) =>
                setFormData({ ...formData, package_type: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select package</option>
              <option value="starter">Starter</option>
              <option value="application">Application</option>
              <option value="visa_ready">Visa Ready</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            placeholder="Payment description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Provider
          </label>
          <select
            value={formData.payment_provider}
            onChange={(e) =>
              setFormData({ ...formData, payment_provider: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="paypal">PayPal (Temporary)</option>
            <option value="moroccan_gateway">Moroccan Gateway (Future)</option>
          </select>
        </div>

        {/* Installments Section */}
        <div className="border-t pt-4">
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={useInstallments}
              onChange={(e) => setUseInstallments(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Use Installment Plan</span>
          </label>

          {useInstallments && (
            <div className="space-y-3 bg-gray-50 p-4 rounded-md">
              {installments.map((inst, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={inst.amount || ''}
                      onChange={(e) =>
                        updateInstallment(index, 'amount', parseFloat(e.target.value))
                      }
                      className="px-3 py-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={inst.description}
                      onChange={(e) =>
                        updateInstallment(index, 'description', e.target.value)
                      }
                      className="px-3 py-2 border rounded-md"
                    />
                    <input
                      type="date"
                      value={inst.due_date}
                      onChange={(e) =>
                        updateInstallment(index, 'due_date', e.target.value)
                      }
                      className="px-3 py-2 border rounded-md"
                    />
                  </div>
                  {installments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstallment(index)}
                      className="text-red-600 hover:text-red-800 px-2 py-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addInstallment}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Installment
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Payment Request'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
