/**
 * Status Badge Component
 * Sprint 06: Reusable status indicator for documents, applications, etc.
 */

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'document' | 'application' | 'default';
  className?: string;
}

const DOCUMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  missing: { label: 'Missing', color: 'bg-gray-100 text-gray-700' },
  uploaded: { label: 'Uploaded', color: 'bg-blue-100 text-blue-700' },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
  needs_correction: { label: 'Needs Correction', color: 'bg-red-100 text-red-700' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
};

const APPLICATION_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  not_started: { label: 'Not Started', color: 'bg-gray-100 text-gray-700' },
  in_preparation: { label: 'In Preparation', color: 'bg-blue-100 text-blue-700' },
  ready_to_submit: { label: 'Ready to Submit', color: 'bg-purple-100 text-purple-700' },
  submitted: { label: 'Submitted', color: 'bg-yellow-100 text-yellow-700' },
  waiting_for_decision: { label: 'Waiting for Decision', color: 'bg-orange-100 text-orange-700' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700' },
};

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  let config = { label: status, color: 'bg-gray-100 text-gray-700' };

  if (variant === 'document' && DOCUMENT_STATUS_CONFIG[status]) {
    config = DOCUMENT_STATUS_CONFIG[status];
  } else if (variant === 'application' && APPLICATION_STATUS_CONFIG[status]) {
    config = APPLICATION_STATUS_CONFIG[status];
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
