/**
 * DS-160 API Routes
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Handles DS-160 form data operations:
 * - GET: Fetch or initialize DS-160 data for current student
 * - POST: Create or update (upsert) DS-160 data with autosave support
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateDS160Completion, getCompletedSections } from '@/lib/validations/ds160';

// ============================================================================
// GET - Fetch DS-160 data for current user
// ============================================================================

export async function GET(request: NextRequest) {
  try {
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
        { error: 'Only students can access DS-160 forms' },
        { status: 403 }
      );
    }

    // Fetch DS-160 data
    const { data: ds160, error } = await supabase
      .from('ds160_data')
      .select('*')
      .eq('student_id', user.id)
      .single();

    // If no DS-160 exists, return empty structure
    if (error || !ds160) {
      return NextResponse.json({
        success: true,
        data: {
          id: null,
          student_id: user.id,
          form_data: {},
          status: 'draft',
          sections_completed: [],
          completion_percentage: 0,
          created_at: null,
          updated_at: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: ds160,
    });

  } catch (error) {
    console.error('Error fetching DS-160 data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DS-160 data' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Create or update DS-160 data (autosave)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
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
        { error: 'Only students can update DS-160 forms' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { form_data } = body;

    if (!form_data) {
      return NextResponse.json(
        { error: 'form_data is required' },
        { status: 400 }
      );
    }

    // Calculate completion metrics
    const completion_percentage = calculateDS160Completion(form_data);
    const sections_completed = getCompletedSections(form_data);

    // Check if DS-160 already exists
    const { data: existing } = await supabase
      .from('ds160_data')
      .select('id, status')
      .eq('student_id', user.id)
      .single();

    let result;

    if (existing) {
      // Update existing DS-160
      // Don't allow updating if status is 'approved' or 'ready_for_submission'
      if (existing.status === 'approved' || existing.status === 'ready_for_submission') {
        return NextResponse.json(
          { error: 'Cannot update DS-160 after approval. Please contact admin to reset.' },
          { status: 400 }
        );
      }

      // If status is 'needs_correction', set back to 'draft' when student makes changes
      const new_status = existing.status === 'needs_correction' ? 'draft' : existing.status;

      const { data, error } = await supabase
        .from('ds160_data')
        .update({
          form_data,
          completion_percentage,
          sections_completed,
          status: new_status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;

    } else {
      // Create new DS-160
      const { data, error } = await supabase
        .from('ds160_data')
        .insert({
          student_id: user.id,
          form_data,
          completion_percentage,
          sections_completed,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'DS-160 data saved successfully',
    });

  } catch (error) {
    console.error('Error saving DS-160 data:', error);
    return NextResponse.json(
      { error: 'Failed to save DS-160 data' },
      { status: 500 }
    );
  }
}
