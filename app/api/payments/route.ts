/**
 * Payments API Routes
 * Sprint 08: Payments and Notifications
 * 
 * GET /api/payments - List payments (filtered by role)
 * POST /api/payments - Create payment request (admin only)
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createNotification, notificationTemplates } from '@/lib/notifications';
import { createPaymentSchema } from '@/lib/validations/payments';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile and role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Build query based on role
    let query = supabase
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
      .order('created_at', { ascending: false });

    // Students can only see their own payments
    if (profile.role === 'student') {
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      query = query.eq('student_id', student.id);
    }

    // Filter by student_id (for admin viewing specific student)
    const studentId = searchParams.get('student_id');
    if (studentId && profile.role === 'admin') {
      query = query.eq('student_id', studentId);
    }

    // Filter by status
    const status = searchParams.get('status');
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    
    // Validate input with Zod
    const validation = createPaymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const {
      student_id,
      amount,
      currency,
      package_type,
      description,
      due_date,
      payment_provider,
      installments,
    } = validation.data;

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        student_id,
        amount,
        currency,
        package_type,
        description,
        due_date,
        payment_provider,
        status: 'pending',
        created_by: user.id,
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment:', paymentError);
      return NextResponse.json({ error: paymentError.message }, { status: 500 });
    }

    // Create installments if provided
    if (installments && Array.isArray(installments) && installments.length > 0) {
      const installmentRecords = installments.map((inst: any, index: number) => ({
        payment_id: payment.id,
        student_id,
        installment_number: index + 1,
        amount: inst.amount,
        description: inst.description,
        due_date: inst.due_date,
        status: 'pending',
      }));

      const { error: installmentError } = await supabase
        .from('payment_installments')
        .insert(installmentRecords);

      if (installmentError) {
        console.error('Error creating installments:', installmentError);
        // Don't fail the whole request, just log the error
      }
    }

    // Create notification for student
    await createNotification({
      userId: student_id,
      ...notificationTemplates.paymentDue(
        amount,
        currency,
        due_date || 'soon'
      ),
      linkUrl: '/dashboard',
      relatedEntityType: 'payment',
      relatedEntityId: payment.id,
      sendEmail: true,
    });

    return NextResponse.json({ data: payment }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
