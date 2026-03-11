/**
 * Document Upload API
 * Sprint 06: Handle file uploads to Supabase Storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/auth/utils';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getUserProfile();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only students and admins can upload documents
    if (!['student', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentId = formData.get('documentId') as string | null;
    const uploadType = (formData.get('uploadType') as string | null) || 'primary';

    if (!file || !documentId) {
      return NextResponse.json(
        { error: 'File and document ID are required' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, JPEG, PNG, WEBP, or Word document' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the document to verify ownership
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*, student:students!inner(*)')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Verify student can only upload their own documents
    if (user.role === 'student' && document.student_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate unique file path
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${document.student_id}/${documentId}_${timestamp}.${fileExtension}`;

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get the current version number
    const { data: existingUploads } = await supabase
      .from('document_uploads')
      .select('version')
      .eq('document_id', documentId)
      .order('version', { ascending: false })
      .limit(1);

    const nextVersion = existingUploads && existingUploads.length > 0 
      ? existingUploads[0].version + 1 
      : 1;

    // Mark all previous uploads as not current
    if (nextVersion > 1) {
      await supabase
        .from('document_uploads')
        .update({ is_current: false })
        .eq('document_id', documentId);
    }

    // Create document_upload record
    const { data: uploadRecord, error: uploadRecordError } = await supabase
      .from('document_uploads')
      .insert({
        document_id: documentId,
        student_id: document.student_id,
        file_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        mime_type: file.type,
        upload_type: uploadType,
        version: nextVersion,
        is_current: true,
        reviewed: false,
      })
      .select()
      .single();

    if (uploadRecordError) {
      console.error('Error creating upload record:', uploadRecordError);
      // Try to clean up the uploaded file
      await supabase.storage.from('documents').remove([uploadData.path]);
      return NextResponse.json(
        { error: 'Failed to create upload record' },
        { status: 500 }
      );
    }

    // Update document status
    const newStatus = uploadType === 'revision' ? 'uploaded' : 'uploaded';
    await supabase
      .from('documents')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    return NextResponse.json({
      success: true,
      data: uploadRecord,
      message: 'Document uploaded successfully',
    });

  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
