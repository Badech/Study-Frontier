/**
 * Resend Email Service
 * Phase 5: Email Integration
 * 
 * Handles sending emails via Resend API
 */

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send an email via Resend
 */
export async function sendEmail(params: SendEmailParams) {
  try {
    // Use configured from email or default
    const fromEmail = params.from || process.env.RESEND_FROM_EMAIL || 'Study Frontier <noreply@studyfrontier.com>';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: params.to,
      subject: params.subject,
      html: params.html,
      replyTo: params.replyTo,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

/**
 * Send multiple emails in batch
 */
export async function sendBatchEmails(emails: SendEmailParams[]) {
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`Batch email results: ${successful} successful, ${failed} failed`);
  
  return results;
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}
