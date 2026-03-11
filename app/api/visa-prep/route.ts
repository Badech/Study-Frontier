/**
 * Visa Preparation API Routes
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Handles visa preparation data operations:
 * - GET: Fetch visa preparation data for a student
 * - POST: Create or update visa preparation data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================================
// GET - Fetch visa preparation data
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Get student_id from query params for admin, or use current user for student
    const { searchParams } = new URL(request.url);
    const studentId = profile?.role === 'admin' 
      ? searchParams.get('student_id') || user.id
      : user.id;

    // Students can only access their own data
    if (profile?.role === 'student' && studentId !== user.id) {
      return NextResponse.json(
        { error: 'You can only access your own visa preparation data' },
        { status: 403 }
      );
    }

    // Fetch visa preparation data
    const { data: visaPrep, error } = await supabase
      .from('visa_preparation')
      .select('*')
      .eq('student_id', studentId)
      .single();

    // If no visa prep exists, return empty structure
    if (error || !visaPrep) {
      return NextResponse.json({
        success: true,
        data: {
          id: null,
          student_id: studentId,
          mock_interview_status: 'not_scheduled',
          last_mock_interview_date: null,
          mock_interview_notes: null,
          checklist_items: [],
          readiness_level: 'not_ready',
          interview_date: null,
          interview_location: null,
          admin_notes: null,
          created_at: null,
          updated_at: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: visaPrep,
    });

  } catch (error) {
    console.error('Error fetching visa preparation data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visa preparation data' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Create or update visa preparation data
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Parse request body
    const body = await request.json();
    const {
      student_id,
      mock_interview_status,
      last_mock_interview_date,
      mock_interview_notes,
      checklist_items,
      readiness_level,
      interview_date,
      interview_location,
      admin_notes,
    } = body;

    // Determine which student's data to update
    let targetStudentId = student_id;
    
    // Students can only update their own data
    if (profile?.role === 'student') {
      targetStudentId = user.id;
    }

    if (!targetStudentId) {
      return NextResponse.json(
        { error: 'student_id is required' },
        { status: 400 }
      );
    }

    // Check if visa prep already exists
    const { data: existing } = await supabase
      .from('visa_preparation')
      .select('id')
      .eq('student_id', targetStudentId)
      .single();

    let result;

    const updateData: any = {};
    if (mock_interview_status !== undefined) updateData.mock_interview_status = mock_interview_status;
    if (last_mock_interview_date !== undefined) updateData.last_mock_interview_date = last_mock_interview_date;
    if (mock_interview_notes !== undefined) updateData.mock_interview_notes = mock_interview_notes;
    if (checklist_items !== undefined) updateData.checklist_items = checklist_items;
    if (readiness_level !== undefined) updateData.readiness_level = readiness_level;
    if (interview_date !== undefined) updateData.interview_date = interview_date;
    if (interview_location !== undefined) updateData.interview_location = interview_location;
    
    // Only admins can update admin_notes
    if (profile?.role === 'admin' && admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    if (existing) {
      // Update existing visa preparation
      const { data, error } = await supabase
        .from('visa_preparation')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;

    } else {
      // Create new visa preparation
      const { data, error } = await supabase
        .from('visa_preparation')
        .insert({
          student_id: targetStudentId,
          ...updateData,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: user.id,
      action_type: 'visa_prep_updated',
      entity_type: 'visa_preparation',
      entity_id: result.id,
      description: `Visa preparation updated`,
      metadata: updateData,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Visa preparation updated successfully',
    });

  } catch (error) {
    console.error('Error updating visa preparation:', error);
    return NextResponse.json(
      { error: 'Failed to update visa preparation data' },
      { status: 500 }
    );
  }
}
