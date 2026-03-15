/**
 * Document Download API
 * Sprint 06: Download uploaded documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/auth/utils';

// GET /api/documents/[id]/download - Download document file
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

    // Get document with current upload
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select(`
        *,
        uploads:document_uploads!inner(*)
      `)
      .eq('id', id)
      .eq('uploads.is_current', true)
      .single();

    if (docError || !document) {
      console.error('Document fetch error:', docError);
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Verify access: Students can only download their own documents, admins can download all
    if (user.role === 'student' && document.student_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Admins and counselors can access all documents
    if (!['admin', 'counselor'].includes(user.role) && document.student_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const currentUpload = document.uploads?.[0];
    if (!currentUpload) {
      return NextResponse.json({ error: 'No file uploaded for this document' }, { status: 404 });
    }

    // Download from Supabase Storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('documents')
      .download(currentUpload.file_path);

    if (storageError || !fileData) {
      console.error('Storage download error:', storageError);
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
    }

    // Return file with appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', currentUpload.file_type);
    headers.set('Content-Disposition', `attachment; filename="${currentUpload.file_name}"`);

    return new NextResponse(fileData, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Download document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
