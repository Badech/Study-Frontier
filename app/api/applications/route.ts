/**
 * Applications API
 * Sprint 06: Create and list applications
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';
import { createApplicationSchema } from '@/lib/validations/applications';

// GET /api/applications - Get applications for a student
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    // Students can only get their own applications
    const targetStudentId = user.role === 'student' ? user.id : studentId;

    if (!targetStudentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        recommendation:school_recommendations(*),
        created_by_profile:profiles!applications_created_by_fkey(full_name, email)
      `)
      .eq('student_id', targetStudentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get applications error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: applications || [] });

  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/applications - Create a new application (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validation = createApplicationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create application
    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        student_id: validation.data.studentId,
        recommendation_id: validation.data.recommendationId,
        school_name: validation.data.schoolName,
        program_name: validation.data.programName,
        degree_level: validation.data.degreeLevel,
        intake: validation.data.intake,
        submission_deadline: validation.data.submissionDeadline,
        application_url: validation.data.applicationUrl || null,
        notes: validation.data.notes,
        status: 'not_started',
        created_by: user.id,
      })
      .select(`
        *,
        recommendation:school_recommendations(*)
      `)
      .single();

    if (error) {
      console.error('Create application error:', error);
      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
      message: 'Application created successfully',
    });

  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
