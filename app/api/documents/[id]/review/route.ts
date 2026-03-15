/**
 * Document Review API
 * Sprint 06: Admin review and feedback on documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/auth/utils';
import { documentReviewSchema } from '@/lib/validations/documents';

// POST /api/documents/[id]/review - Review a document (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getUserProfile();
    if (!user || !['admin', 'counselor'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validation = documentReviewSchema.safeParse({
      documentId: id,
      ...body,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { status, adminFeedback } = validation.data;
    const supabase = await createClient();

    // Update document with review
    const { data: document, error } = await supabase
      .from('documents')
      .update({
        status,
        admin_feedback: adminFeedback,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        student:students!inner(id),
        reviewed_by_profile:profiles!documents_reviewed_by_fkey(full_name, email)
      `)
      .single();

    if (error) {
      console.error('Review document error:', error);
      return NextResponse.json(
        { error: 'Failed to review document' },
        { status: 500 }
      );
    }

    // Mark uploads as reviewed
    await supabase
      .from('document_uploads')
      .update({ reviewed: true })
      .eq('document_id', id)
      .eq('is_current', true);

    // Create notification for student
    const { createNotification, notificationTemplates } = await import('@/lib/notifications');
    
    if (status === 'approved') {
      await createNotification({
        userId: document.student_id,
        ...notificationTemplates.documentApproved(document.display_name),
        linkUrl: '/dashboard/documents',
        relatedEntityType: 'document',
        relatedEntityId: id,
        sendEmail: true,
      });
    } else if (status === 'needs_correction' && adminFeedback) {
      await createNotification({
        userId: document.student_id,
        ...notificationTemplates.documentNeedsCorrection(
          document.display_name,
          adminFeedback
        ),
        linkUrl: '/dashboard/documents',
        relatedEntityType: 'document',
        relatedEntityId: id,
        sendEmail: true,
      });
    }
    // await createNotification({
    //   userId: document.student.id,
    //   type: 'document_reviewed',
    //   title: 'Document Reviewed',
    //   message: `Your ${document.display_name} has been ${status === 'approved' ? 'approved' : 'reviewed'}`,
    // });

    return NextResponse.json({
      success: true,
      data: document,
      message: 'Document reviewed successfully',
    });

  } catch (error) {
    console.error('Document review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
