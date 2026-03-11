/**
 * Payment Approval API Route
 * Sprint 08: Payments and Notifications
 * 
 * POST /api/payments/[id]/approve - Approve payment and mark as invoice_sent
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
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
    const { external_invoice_id, notes } = body;

    // Update payment status to invoice_sent
    const { data: payment, error } = await supabase
      .from('payments')
      .update({
        status: 'invoice_sent',
        external_invoice_id,
        admin_notes: notes,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error approving payment:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: payment,
      message: 'Payment approved and invoice sent',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
