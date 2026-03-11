/**
 * Single Payment API Routes
 * Sprint 08: Payments and Notifications
 * 
 * GET /api/payments/[id] - Get payment details
 * PATCH /api/payments/[id] - Update payment (admin only)
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createNotification, notificationTemplates } from '@/lib/notifications';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get payment with student info
    const { data: payment, error } = await supabase
      .from('payments')
      .select(`
        *,
        student:students!inner(
          id,
          profiles!inner(
            full_name,
            email
          )
        ),
        installments:payment_installments(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching payment:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check authorization
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Students can only view their own payments
    if (profile?.role === 'student' && payment.student_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ data: payment });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      status,
      external_invoice_id,
      external_payment_id,
      payment_method,
      paid_at,
      admin_notes,
    } = body;

    // Get existing payment for notification logic
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('status, student_id, amount, currency')
      .eq('id', id)
      .single();

    // Update payment
    const { data: payment, error } = await supabase
      .from('payments')
      .update({
        ...(status && { status }),
        ...(external_invoice_id !== undefined && { external_invoice_id }),
        ...(external_payment_id !== undefined && { external_payment_id }),
        ...(payment_method !== undefined && { payment_method }),
        ...(paid_at !== undefined && { paid_at }),
        ...(admin_notes !== undefined && { admin_notes }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send notification if status changed to paid
    if (
      existingPayment &&
      existingPayment.status !== 'paid' &&
      status === 'paid'
    ) {
      await createNotification({
        userId: existingPayment.student_id,
        ...notificationTemplates.paymentReceived(
          existingPayment.amount,
          existingPayment.currency
        ),
        linkUrl: '/dashboard',
        relatedEntityType: 'payment',
        relatedEntityId: id,
        sendEmail: true,
      });
    }

    return NextResponse.json({ data: payment });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
