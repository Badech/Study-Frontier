/**
 * DS-160 Submit for Review API Route
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Handles student submission of DS-160 for admin review.
 * Changes status from 'draft' to 'submitted_for_review'.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isDS160ReadyForSubmission } from '@/lib/validations/ds160';

// ============================================================================
// POST - Submit DS-160 for review
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is a student
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can submit DS-160 forms' },
        { status: 403 }
      );
    }

    // Fetch DS-160 to verify ownership and check completion
    const { data: ds160, error: fetchError } = await supabase
      .from('ds160_data')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !ds160) {
      return NextResponse.json(
        { error: 'DS-160 not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (ds160.student_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only submit your own DS-160' },
        { status: 403 }
      );
    }

    // Verify status allows submission
    if (ds160.status === 'submitted_for_review') {
      return NextResponse.json(
        { error: 'DS-160 has already been submitted for review' },
        { status: 400 }
      );
    }

    if (ds160.status === 'approved' || ds160.status === 'ready_for_submission') {
      return NextResponse.json(
        { error: 'DS-160 has already been approved' },
        { status: 400 }
      );
    }

    // Check if form is sufficiently complete
    if (!isDS160ReadyForSubmission(ds160.form_data)) {
      return NextResponse.json(
        { error: 'DS-160 must be at least 80% complete before submission. Please complete more sections.' },
        { status: 400 }
      );
    }

    // Update status to submitted_for_review
    const { data: updatedDS160, error: updateError } = await supabase
      .from('ds160_data')
      .update({
        status: 'submitted_for_review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: user.id,
      action_type: 'ds160_submitted',
      entity_type: 'ds160_data',
      entity_id: id,
      description: 'DS-160 submitted for admin review',
      metadata: {
        completion_percentage: ds160.completion_percentage,
        sections_completed: ds160.sections_completed,
      },
    });

    // Create notification for student about review completion
    const { createNotification, notificationTemplates } = await import('@/lib/notifications');
    
    await createNotification({
      userId: updatedDS160.student_id,
      ...notificationTemplates.ds160ReviewComplete('submitted for review'),
      linkUrl: '/dashboard/visa/ds160',
      relatedEntityType: 'ds160',
      relatedEntityId: id,
      sendEmail: true,
    });
    // For now, we can create a task for admin to review
    await supabase.from('tasks').insert({
      student_id: user.id,
      title: 'Review DS-160 submission',
      description: `Student has submitted DS-160 for review (${ds160.completion_percentage}% complete)`,
      category: 'visa',
      priority: 'high',
      status: 'pending',
      visible_to_student: false,
    });

    return NextResponse.json({
      success: true,
      data: updatedDS160,
      message: 'DS-160 submitted for review successfully. An admin will review it shortly.',
    });

  } catch (error) {
    console.error('Error submitting DS-160:', error);
    return NextResponse.json(
      { error: 'Failed to submit DS-160 for review' },
      { status: 500 }
    );
  }
}
