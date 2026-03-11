/**
 * DS-160 Individual Record API Routes
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Handles operations on specific DS-160 records:
 * - GET: Fetch specific DS-160 (admin can view any, student only their own)
 * - PATCH: Update DS-160 status or review notes (admin only)
 * - DELETE: Delete DS-160 record (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================================
// GET - Fetch specific DS-160 by ID
// ============================================================================

export async function GET(
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Fetch DS-160
    const { data: ds160, error } = await supabase
      .from('ds160_data')
      .select(`
        *,
        student:students!inner(
          *,
          profile:profiles!inner(*)
        ),
        reviewed_by_profile:profiles!ds160_data_reviewed_by_fkey(full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error || !ds160) {
      return NextResponse.json(
        { error: 'DS-160 not found' },
        { status: 404 }
      );
    }

    // Authorization check
    if (profile?.role === 'student' && ds160.student_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only access your own DS-160' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ds160,
    });

  } catch (error) {
    console.error('Error fetching DS-160:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DS-160' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH - Update DS-160 (admin review actions)
// ============================================================================

export async function PATCH(
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

    // Verify user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can update DS-160 status' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { status, review_notes } = body;

    // Validate status
    const validStatuses = ['draft', 'submitted_for_review', 'needs_correction', 'approved', 'ready_for_submission'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update DS-160
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      updateData.reviewed_by = user.id;
      updateData.reviewed_at = new Date().toISOString();
    }
    
    if (review_notes !== undefined) {
      updateData.review_notes = review_notes;
    }

    const { data, error } = await supabase
      .from('ds160_data')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: user.id,
      action_type: 'ds160_reviewed',
      entity_type: 'ds160_data',
      entity_id: id,
      description: `DS-160 status updated to: ${status || 'reviewed'}`,
      metadata: { status, review_notes },
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'DS-160 updated successfully',
    });

  } catch (error) {
    console.error('Error updating DS-160:', error);
    return NextResponse.json(
      { error: 'Failed to update DS-160' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE - Delete DS-160 (admin only, use with caution)
// ============================================================================

export async function DELETE(
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

    // Verify user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can delete DS-160 records' },
        { status: 403 }
      );
    }

    // Delete DS-160
    const { error } = await supabase
      .from('ds160_data')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: user.id,
      action_type: 'ds160_deleted',
      entity_type: 'ds160_data',
      entity_id: id,
      description: 'DS-160 record deleted',
    });

    return NextResponse.json({
      success: true,
      message: 'DS-160 deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting DS-160:', error);
    return NextResponse.json(
      { error: 'Failed to delete DS-160' },
      { status: 500 }
    );
  }
}
