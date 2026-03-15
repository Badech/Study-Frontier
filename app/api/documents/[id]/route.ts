/**
 * Document CRUD API
 * Sprint 06: Get, update, delete documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/auth/utils';

// GET /api/documents/[id] - Get a single document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getUserProfile();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: document, error } = await supabase
      .from('documents')
      .select(`
        *,
        uploads:document_uploads(*),
        reviewed_by_profile:profiles!documents_reviewed_by_fkey(full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Verify access
    if (user.role === 'student' && document.student_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: document });

  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/documents/[id] - Update document (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getUserProfile();
    if (!user || !['admin', 'counselor'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const supabase = await createClient();

    const { data: document, error } = await supabase
      .from('documents')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update document error:', error);
      return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: document });

  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/documents/[id] - Delete document (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getUserProfile();
    if (!user || !['admin', 'counselor'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = await createClient();

    // Get all uploads to delete from storage
    const { data: uploads } = await supabase
      .from('document_uploads')
      .select('file_path')
      .eq('document_id', id);

    // Delete from storage
    if (uploads && uploads.length > 0) {
      const filePaths = uploads.map(u => u.file_path);
      await supabase.storage.from('documents').remove(filePaths);
    }

    // Delete document (cascade will delete uploads)
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete document error:', error);
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Document deleted' });

  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
