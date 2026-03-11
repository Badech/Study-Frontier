/**
 * DS-160 Progress Indicator Component
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Shows completion percentage and status badge.
 */

'use client';

import type { DS160Status } from '@/types';

interface DS160ProgressProps {
  completionPercentage: number;
  status: DS160Status;
  sectionsCompleted?: string[];
}

const STATUS_CONFIG: Record<DS160Status, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  submitted_for_review: { label: 'Under Review', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  needs_correction: { label: 'Needs Correction', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  approved: { label: 'Approved', color: 'text-green-700', bgColor: 'bg-green-100' },
  ready_for_submission: { label: 'Ready for Submission', color: 'text-purple-700', bgColor: 'bg-purple-100' },
};

export function DS160Progress({ completionPercentage, status, sectionsCompleted = [] }: DS160ProgressProps) {
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <div className="space-y-4">
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Status</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Completion progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Completion</span>
          <span className="text-sm font-semibold text-gray-900">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Sections completed */}
      {sectionsCompleted.length > 0 && (
        <div>
          <span className="text-sm font-medium text-gray-700">Sections Completed</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {sectionsCompleted.map((section) => (
              <span
                key={section}
                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md"
              >
                ✓ {section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
