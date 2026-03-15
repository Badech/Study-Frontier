/**
 * Document View API
 * Sprint 06: View uploaded documents inline (e.g., in browser tab)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/auth/utils';

// GET /api/documents/[id]/view - View document file inline
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getUserProfile();
    console.log('View document - User:', { id: user?.id, role: user?.role });
    
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

    console.log('Document query result:', { 
      found: !!document, 
      error: docError,
      studentId: document?.student_id,
      uploadsCount: document?.uploads?.length 
    });

    if (docError || !document) {
      console.error('Document fetch error:', docError);
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Verify access: Admins and counselors can access all documents
    const isAdmin = ['admin', 'counselor'].includes(user.role);
    const isOwner = document.student_id === user.id;
    
    console.log('Access check:', { isAdmin, isOwner, userRole: user.role, studentId: document.student_id });
    
    if (!isAdmin && !isOwner) {
      console.error('Access denied:', { userRole: user.role, userId: user.id, documentStudentId: document.student_id });
      return NextResponse.json({ error: 'Forbidden - You do not have access to this document' }, { status: 403 });
    }

    const currentUpload = document.uploads?.[0];
    if (!currentUpload) {
      return NextResponse.json({ error: 'No file uploaded for this document' }, { status: 404 });
    }

    console.log('Current upload details:', {
      fileName: currentUpload.file_name,
      fileType: currentUpload.file_type,
      filePath: currentUpload.file_path,
      fileSize: currentUpload.file_size
    });

    // Download from Supabase Storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('documents')
      .download(currentUpload.file_path);

    if (storageError || !fileData) {
      console.error('Storage download error:', storageError);
      return NextResponse.json({ error: 'Failed to view file' }, { status: 500 });
    }

    console.log('File downloaded successfully, size:', fileData.size);

    // Return file with inline display headers
    const headers = new Headers();
    // Force PDF content type if the file is a PDF
    const contentType = currentUpload.file_type || 'application/pdf';
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `inline; filename="${currentUpload.file_name}"`);
    
    console.log('Serving file with headers:', { contentType, fileName: currentUpload.file_name });

    return new NextResponse(fileData, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('View document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
