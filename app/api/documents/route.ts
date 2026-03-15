/**
 * Documents API
 * Sprint 06: Create and list documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';
import { createDocumentSchema } from '@/lib/validations/documents';

// GET /api/documents - Get documents for a student
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    // Students can only get their own documents
    const targetStudentId = profile.role === 'student' ? user.id : studentId;

    if (!targetStudentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        *,
        uploads:document_uploads(*)
      `)
      .eq('student_id', targetStudentId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Get documents error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: documents || [] });

  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/documents - Create a new document requirement (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'student'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Simple validation for students (they only provide student_id, document_type, status)
    if (profile.role === 'student') {
      // Students can only create their own documents
      if (body.student_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Generate display name from document type
      const displayName = body.document_type
        .split('_')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Create simple document record for student upload
      const { data: document, error } = await supabase
        .from('documents')
        .insert({
          student_id: user.id,
          document_type: body.document_type,
          display_name: displayName,
          status: 'missing', // Valid statuses: missing, uploaded, under_review, needs_correction, approved
        })
        .select()
        .single();

      if (error) {
        console.error('Create document error:', error);
        return NextResponse.json(
          { error: 'Failed to create document' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        document: document,
        message: 'Document created successfully',
      });
    }

    // Admin flow with full validation
    const validation = createDocumentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Create document
    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        student_id: validation.data.studentId,
        document_type: validation.data.documentType,
        display_name: validation.data.displayName,
        description: validation.data.description,
        is_required: validation.data.isRequired,
        category: validation.data.category,
        due_date: validation.data.dueDate,
        priority: validation.data.priority,
        status: 'missing',
      })
      .select()
      .single();

    if (error) {
      console.error('Create document error:', error);
      return NextResponse.json(
        { error: 'Failed to create document' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      document: document,
      message: 'Document created successfully',
    });

  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
