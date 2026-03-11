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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    // Students can only get their own documents
    const targetStudentId = user.role === 'student' ? user.id : studentId;

    if (!targetStudentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

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
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validation = createDocumentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const supabase = await createClient();

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
      data: document,
      message: 'Document created successfully',
    });

  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
