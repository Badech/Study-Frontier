/**
 * Notification Helper Functions
 * Sprint 08: Payments and Notifications
 * 
 * Centralized notification creation with email hooks
 */

import { createClient } from '@/lib/supabase/server';

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  sendEmail?: boolean;
}

export type NotificationType =
  | 'document_uploaded'
  | 'document_approved'
  | 'document_needs_correction'
  | 'stage_changed'
  | 'payment_due'
  | 'payment_received'
  | 'appointment_booked'
  | 'appointment_reminder'
  | 'message_received'
  | 'task_assigned'
  | 'task_completed'
  | 'application_status_changed'
  | 'ds160_review_complete';

/**
 * Create an in-app notification
 */
export async function createNotification(params: CreateNotificationParams) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      link_url: params.linkUrl,
      related_entity_type: params.relatedEntityType,
      related_entity_id: params.relatedEntityId,
      email_sent: false,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create notification:', error);
    return null;
  }

  // Email hook: Queue for sending if requested
  if (params.sendEmail && data) {
    await queueEmailNotification(data.id, params);
  }

  return data;
}

/**
 * Create multiple notifications at once
 */
export async function createNotifications(notifications: CreateNotificationParams[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notifications')
    .insert(
      notifications.map((n) => ({
        user_id: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        link_url: n.linkUrl,
        related_entity_type: n.relatedEntityType,
        related_entity_id: n.relatedEntityId,
        email_sent: false,
        is_read: false,
      }))
    )
    .select();

  if (error) {
    console.error('Failed to create notifications:', error);
    return [];
  }

  return data;
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', notificationId);

  if (error) {
    console.error('Failed to mark notification as read:', error);
    return false;
  }

  return true;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsRead(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Failed to mark all notifications as read:', error);
    return false;
  }

  return true;
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Failed to get unread count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Queue email notification for sending
 * Phase 5: Email Integration - Now fully implemented with Resend
 */
async function queueEmailNotification(
  notificationId: string,
  params: CreateNotificationParams
) {
  try {
    // Check if email service is configured
    const { isEmailConfigured } = await import('@/lib/email/resend');
    if (!isEmailConfigured()) {
      console.log('[Email] Service not configured, skipping email send');
      return;
    }

    const supabase = await createClient();

    // Get user email from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', params.userId)
      .single();

    if (profileError || !profile?.email) {
      console.error('[Email] Failed to get user email:', profileError);
      return;
    }

    // Get student data for email personalization
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('id', params.userId)
      .single();

    const studentName = profile.full_name || student?.first_name || 'Student';

    // Prepare email data based on notification type
    const emailData = {
      studentName,
      ...extractEmailDataFromParams(params),
    };

    // Get email template
    const { getEmailTemplate } = await import('@/lib/email/templates');
    const { subject, html } = getEmailTemplate(params.type, emailData);

    // Send email via Resend
    const { sendEmail } = await import('@/lib/email/resend');
    const result = await sendEmail({
      to: profile.email,
      subject,
      html,
    });

    if (result.success) {
      // Update notification as email sent
      await supabase
        .from('notifications')
        .update({
          email_sent: true,
          email_sent_at: new Date().toISOString(),
        })
        .eq('id', notificationId);

      console.log(`[Email] Sent successfully to ${profile.email}`);
    } else {
      console.error('[Email] Failed to send:', result.error);
    }
  } catch (error) {
    console.error('[Email] Error in queueEmailNotification:', error);
  }
}

/**
 * Extract email-specific data from notification params
 */
function extractEmailDataFromParams(params: CreateNotificationParams): Record<string, any> {
  // Parse the message to extract structured data
  // This is a helper to work with existing notification calls
  const data: Record<string, any> = {
    message: params.message,
    title: params.title,
  };

  // Extract document name from messages like "Your Passport has been approved"
  if (params.type === 'document_approved' || params.type === 'document_needs_correction') {
    const match = params.message.match(/Your (.+?) (has been|needs)/);
    if (match) {
      data.documentName = match[1];
    }
    
    // Extract feedback for corrections
    if (params.type === 'document_needs_correction') {
      const feedbackMatch = params.message.match(/correction: (.+)/);
      if (feedbackMatch) {
        data.feedback = feedbackMatch[1];
      }
    }
  }

  // Extract stage name from "You've moved to the X stage"
  if (params.type === 'stage_changed') {
    const match = params.message.match(/to the (.+?) stage/);
    if (match) {
      data.newStage = match[1];
    }
  }

  // Extract payment info from "Payment of USD 500 is due on..."
  if (params.type === 'payment_due' || params.type === 'payment_received') {
    const amountMatch = params.message.match(/(USD|EUR|MAD) ([\d.]+)/);
    if (amountMatch) {
      data.currency = amountMatch[1];
      data.amount = parseFloat(amountMatch[2]);
    }
    
    if (params.type === 'payment_due') {
      const dateMatch = params.message.match(/on (.+)/);
      if (dateMatch) {
        data.dueDate = dateMatch[1];
      }
    }
  }

  // Extract appointment info
  if (params.type === 'appointment_booked' || params.type === 'appointment_reminder') {
    const typeMatch = params.message.match(/Your (.+?) appointment/);
    if (typeMatch) {
      data.appointmentType = typeMatch[1];
    }
    
    const dateMatch = params.message.match(/for (.+)/);
    if (dateMatch) {
      data.appointmentDate = dateMatch[1];
    }
  }

  // Extract message sender and preview
  if (params.type === 'message_received') {
    data.senderName = 'Study Frontier Team';
    data.messagePreview = params.message.substring(0, 150) + '...';
  }

  return data;
}

/**
 * Notification templates for common events
 */
export const notificationTemplates = {
  documentApproved: (documentName: string) => ({
    type: 'document_approved' as NotificationType,
    title: 'Document Approved',
    message: `Your ${documentName} has been approved.`,
  }),

  documentNeedsCorrection: (documentName: string, feedback: string) => ({
    type: 'document_needs_correction' as NotificationType,
    title: 'Document Needs Correction',
    message: `Your ${documentName} needs correction: ${feedback}`,
  }),

  stageChanged: (newStage: string) => ({
    type: 'stage_changed' as NotificationType,
    title: 'Progress Update',
    message: `You've moved to the ${newStage} stage.`,
  }),

  paymentDue: (amount: number, currency: string, dueDate: string) => ({
    type: 'payment_due' as NotificationType,
    title: 'Payment Due',
    message: `Payment of ${currency} ${amount} is due on ${dueDate}.`,
  }),

  paymentReceived: (amount: number, currency: string) => ({
    type: 'payment_received' as NotificationType,
    title: 'Payment Received',
    message: `Your payment of ${currency} ${amount} has been received. Thank you!`,
  }),

  appointmentBooked: (type: string, date: string) => ({
    type: 'appointment_booked' as NotificationType,
    title: 'Appointment Booked',
    message: `Your ${type} appointment is scheduled for ${date}.`,
  }),

  ds160ReviewComplete: (status: string) => ({
    type: 'ds160_review_complete' as NotificationType,
    title: 'DS-160 Review Complete',
    message: `Your DS-160 form review is complete. Status: ${status}`,
  }),
};
