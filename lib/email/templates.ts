/**
 * Email Templates
 * Phase 5: Email Integration
 * 
 * HTML email templates for all notification types
 */

import type { NotificationType } from '@/lib/notifications';

/**
 * Base email template wrapper
 */
function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Study Frontier</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px 20px;
    }
    .content h2 {
      color: #333;
      font-size: 20px;
      margin-top: 0;
    }
    .content p {
      color: #666;
      margin: 15px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #667eea;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      background: #f8f8f8;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #eee;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Study Frontier</h1>
    </div>
    ${content}
    <div class="footer">
      <p>© 2026 Study Frontier. All rights reserved.</p>
      <p>
        <a href="https://studyfrontier.com/privacy">Privacy Policy</a> | 
        <a href="https://studyfrontier.com/terms">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Welcome email for new students
 */
export function welcomeEmail(studentName: string, dashboardUrl: string): string {
  const content = `
    <div class="content">
      <h2>Welcome to Study Frontier, ${studentName}! 🎓</h2>
      <p>We're thrilled to have you join us on your journey to studying in the USA.</p>
      <p>Your student portal is now active. Here's what you can do:</p>
      <ul>
        <li>Upload required documents</li>
        <li>Track your application progress</li>
        <li>Schedule appointments with our counselors</li>
        <li>Receive personalized guidance</li>
      </ul>
      <a href="${dashboardUrl}" class="button">Go to Your Dashboard</a>
      <p>If you have any questions, our team is here to help. Simply reach out through the messages section in your portal.</p>
      <p>Best regards,<br>The Study Frontier Team</p>
    </div>
  `;
  return emailWrapper(content);
}

/**
 * Assessment received confirmation
 */
export function assessmentReceivedEmail(name: string): string {
  const content = `
    <div class="content">
      <h2>Thank You for Your Assessment, ${name}! ✅</h2>
      <p>We've received your eligibility assessment and our team is reviewing it.</p>
      <p>We'll contact you within 24-48 hours to discuss:</p>
      <ul>
        <li>Your eligibility for studying in the USA</li>
        <li>Recommended universities and programs</li>
        <li>Our consulting packages tailored to your needs</li>
        <li>Next steps in your journey</li>
      </ul>
      <p>In the meantime, feel free to explore our website to learn more about our services.</p>
      <p>Best regards,<br>The Study Frontier Team</p>
    </div>
  `;
  return emailWrapper(content);
}

/**
 * Document approved email
 */
export function documentApprovedEmail(
  studentName: string,
  documentName: string,
  dashboardUrl: string
): string {
  const content = `
    <div class="content">
      <h2>Document Approved ✅</h2>
      <p>Hi ${studentName},</p>
      <p>Great news! Your <strong>${documentName}</strong> has been reviewed and approved.</p>
      <p>You're one step closer to your goal. Keep up the excellent work!</p>
      <a href="${dashboardUrl}" class="button">View Your Documents</a>
      <p>Best regards,<br>The Study Frontier Team</p>
    </div>
  `;
  return emailWrapper(content);
}

/**
 * Document needs correction email
 */
export function documentNeedsCorrectionEmail(
  studentName: string,
  documentName: string,
  feedback: string,
  dashboardUrl: string
): string {
  const content = `
    <div class="content">
      <h2>Document Requires Revision 📝</h2>
      <p>Hi ${studentName},</p>
      <p>We've reviewed your <strong>${documentName}</strong> and it needs some corrections.</p>
      <p><strong>Feedback from our team:</strong></p>
      <p style="background: #f8f8f8; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0;">
        ${feedback}
      </p>
      <p>Please make the necessary updates and resubmit the document.</p>
      <a href="${dashboardUrl}" class="button">Update Document</a>
      <p>If you have any questions about the feedback, don't hesitate to reach out.</p>
      <p>Best regards,<br>The Study Frontier Team</p>
    </div>
  `;
  return emailWrapper(content);
}

/**
 * Stage changed email
 */
export function stageChangedEmail(
  studentName: string,
  newStage: string,
  dashboardUrl: string
): string {
  const content = `
    <div class="content">
      <h2>Progress Update: ${newStage} 🎯</h2>
      <p>Hi ${studentName},</p>
      <p>Congratulations! You've advanced to the <strong>${newStage}</strong> stage of your journey.</p>
      <p>Check your dashboard to see what's next and any new tasks assigned to you.</p>
      <a href="${dashboardUrl}" class="button">View Your Progress</a>
      <p>Keep up the great momentum!</p>
      <p>Best regards,<br>The Study Frontier Team</p>
    </div>
  `;
  return emailWrapper(content);
}

/**
 * Payment due email
 */
export function paymentDueEmail(
  studentName: string,
  amount: number,
  currency: string,
  dueDate: string,
  dashboardUrl: string
): string {
  const content = `
    <div class="content">
      <h2>Payment Reminder 💳</h2>
      <p>Hi ${studentName},</p>
      <p>This is a friendly reminder that you have a payment due.</p>
      <p><strong>Amount:</strong> ${currency} ${amount.toFixed(2)}</p>
      <p><strong>Due Date:</strong> ${dueDate}</p>
      <p>Please complete your payment by the due date to avoid any delays in your application process.</p>
      <a href="${dashboardUrl}" class="button">Make Payment</a>
      <p>If you've already made this payment, please disregard this message.</p>
      <p>Best regards,<br>The Study Frontier Team</p>
    </div>
  `;
  return emailWrapper(content);
}

/**
 * Payment received email
 */
export function paymentReceivedEmail(
  studentName: string,
  amount: number,
  currency: string,
  dashboardUrl: string
): string {
  const content = `
    <div class="content">
      <h2>Payment Received ✅</h2>
      <p>Hi ${studentName},</p>
      <p>Thank you! We've received your payment of <strong>${currency} ${amount.toFixed(2)}</strong>.</p>
      <p>Your payment has been processed and applied to your account.</p>
      <a href="${dashboardUrl}" class="button">View Payment History</a>
      <p>Best regards,<br>The Study Frontier Team</p>
    </div>
  `;
  return emailWrapper(content);
}

/**
 * Appointment booked email
 */
export function appointmentBookedEmail(
  studentName: string,
  appointmentType: string,
  appointmentDate: string,
  meetingLink: string | null,
  dashboardUrl: string
): string {
  const content = `
    <div class="content">
      <h2>Appointment Confirmed 📅</h2>
      <p>Hi ${studentName},</p>
      <p>Your <strong>${appointmentType}</strong> appointment has been scheduled.</p>
      <p><strong>Date & Time:</strong> ${appointmentDate}</p>
      ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
      <p>We'll send you a reminder 24 hours before your appointment.</p>
      <a href="${dashboardUrl}" class="button">View Appointments</a>
      <p>Looking forward to speaking with you!</p>
      <p>Best regards,<br>The Study Frontier Team</p>
    </div>
  `;
  return emailWrapper(content);
}

/**
 * Appointment reminder email (24h before)
 */
export function appointmentReminderEmail(
  studentName: string,
  appointmentType: string,
  appointmentDate: string,
  meetingLink: string | null,
  dashboardUrl: string
): string {
  const content = `
    <div class="content">
      <h2>Appointment Reminder ⏰</h2>
      <p>Hi ${studentName},</p>
      <p>This is a reminder that you have a <strong>${appointmentType}</strong> appointment scheduled for tomorrow.</p>
      <p><strong>Date & Time:</strong> ${appointmentDate}</p>
      ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
      <p>Please ensure you're prepared and have any questions ready.</p>
      <a href="${dashboardUrl}" class="button">View Appointment Details</a>
      <p>See you soon!</p>
      <p>Best regards,<br>The Study Frontier Team</p>
    </div>
  `;
  return emailWrapper(content);
}

/**
 * New message notification email
 */
export function newMessageEmail(
  studentName: string,
  senderName: string,
  messagePreview: string,
  dashboardUrl: string
): string {
  const content = `
    <div class="content">
      <h2>New Message 💬</h2>
      <p>Hi ${studentName},</p>
      <p>You have a new message from <strong>${senderName}</strong>:</p>
      <p style="background: #f8f8f8; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0;">
        ${messagePreview}
      </p>
      <a href="${dashboardUrl}" class="button">View Message</a>
      <p>Best regards,<br>The Study Frontier Team</p>
    </div>
  `;
  return emailWrapper(content);
}

/**
 * Get email template based on notification type
 */
export function getEmailTemplate(
  type: NotificationType,
  data: Record<string, any>
): { subject: string; html: string } {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const dashboardUrl = `${baseUrl}/en/dashboard`;

  switch (type) {
    case 'document_approved':
      return {
        subject: `Document Approved: ${data.documentName}`,
        html: documentApprovedEmail(data.studentName, data.documentName, dashboardUrl),
      };

    case 'document_needs_correction':
      return {
        subject: `Document Needs Revision: ${data.documentName}`,
        html: documentNeedsCorrectionEmail(
          data.studentName,
          data.documentName,
          data.feedback,
          dashboardUrl
        ),
      };

    case 'stage_changed':
      return {
        subject: `Progress Update: ${data.newStage}`,
        html: stageChangedEmail(data.studentName, data.newStage, dashboardUrl),
      };

    case 'payment_due':
      return {
        subject: 'Payment Reminder',
        html: paymentDueEmail(
          data.studentName,
          data.amount,
          data.currency,
          data.dueDate,
          dashboardUrl
        ),
      };

    case 'payment_received':
      return {
        subject: 'Payment Received - Thank You',
        html: paymentReceivedEmail(data.studentName, data.amount, data.currency, dashboardUrl),
      };

    case 'appointment_booked':
      return {
        subject: `Appointment Confirmed: ${data.appointmentType}`,
        html: appointmentBookedEmail(
          data.studentName,
          data.appointmentType,
          data.appointmentDate,
          data.meetingLink,
          dashboardUrl
        ),
      };

    case 'appointment_reminder':
      return {
        subject: `Reminder: ${data.appointmentType} Tomorrow`,
        html: appointmentReminderEmail(
          data.studentName,
          data.appointmentType,
          data.appointmentDate,
          data.meetingLink,
          dashboardUrl
        ),
      };

    case 'message_received':
      return {
        subject: `New Message from ${data.senderName}`,
        html: newMessageEmail(data.studentName, data.senderName, data.messagePreview, dashboardUrl),
      };

    default:
      return {
        subject: 'Study Frontier Notification',
        html: emailWrapper(`
          <div class="content">
            <h2>Notification</h2>
            <p>Hi ${data.studentName},</p>
            <p>You have a new notification in your Study Frontier dashboard.</p>
            <a href="${dashboardUrl}" class="button">View Dashboard</a>
            <p>Best regards,<br>The Study Frontier Team</p>
          </div>
        `),
      };
  }
}
