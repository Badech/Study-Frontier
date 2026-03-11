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
 * 
 * This is a hook for future email integration.
 * For now, it just marks the intention to send.
 * 
 * Future: Integrate with email service (SendGrid, Resend, etc.)
 */
async function queueEmailNotification(
  notificationId: string,
  params: CreateNotificationParams
) {
  // TODO: Integrate with email service
  // For now, just log the intent
  
  console.log(`[Email Hook] Notification ${notificationId} queued for email to user ${params.userId}`);
  
  // Future implementation:
  // 1. Get user email from profiles table
  // 2. Format email template based on notification type
  // 3. Send via email service
  // 4. Update notification.email_sent = true
  // 5. Set notification.email_sent_at timestamp
  
  // Example structure:
  // const supabase = await createClient();
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('email')
  //   .eq('id', params.userId)
  //   .single();
  //
  // if (profile?.email) {
  //   await emailService.send({
  //     to: profile.email,
  //     subject: params.title,
  //     html: renderEmailTemplate(params.type, params),
  //   });
  //
  //   await supabase
  //     .from('notifications')
  //     .update({ email_sent: true, email_sent_at: new Date().toISOString() })
  //     .eq('id', notificationId);
  // }
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
