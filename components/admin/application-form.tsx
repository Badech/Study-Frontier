/**
 * Application Form Component
 * Sprint 06: Admin interface for creating/editing applications
 */

'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Application, ApplicationStatus } from '@/types';

interface ApplicationFormProps {
  studentId: string;
  application?: Application;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ApplicationForm({ studentId, application, onSuccess, onCancel }: ApplicationFormProps) {
  const isEdit = !!application;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    schoolName: application?.school_name || '',
    programName: application?.program_name || '',
    degreeLevel: application?.degree_level || '',
    intake: application?.intake || '',
    status: application?.status || 'not_started' as ApplicationStatus,
    submissionDeadline: application?.submission_deadline || '',
    applicationUrl: application?.application_url || '',
    notes: application?.notes || '',
    nextAction: application?.next_action || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = isEdit ? `/api/applications/${application.id}` : '/api/applications';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studentId: isEdit ? undefined : studentId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save application');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Submit error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">
            School Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="schoolName"
            required
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="programName" className="block text-sm font-medium text-gray-700">
            Program Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="programName"
            required
            value={formData.programName}
            onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="degreeLevel" className="block text-sm font-medium text-gray-700">
            Degree Level <span className="text-red-500">*</span>
          </label>
          <select
            id="degreeLevel"
            required
            value={formData.degreeLevel}
            onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
            <option value="Certificate">Certificate</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>

        <div>
          <label htmlFor="intake" className="block text-sm font-medium text-gray-700">
            Intake
          </label>
          <input
            type="text"
            id="intake"
            placeholder="e.g., Fall 2024"
            value={formData.intake}
            onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {isEdit && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="not_started">Not Started</option>
              <option value="in_preparation">In Preparation</option>
              <option value="ready_to_submit">Ready to Submit</option>
              <option value="submitted">Submitted</option>
              <option value="waiting_for_decision">Waiting for Decision</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="submissionDeadline" className="block text-sm font-medium text-gray-700">
            Submission Deadline
          </label>
          <input
            type="date"
            id="submissionDeadline"
            value={formData.submissionDeadline}
            onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="applicationUrl" className="block text-sm font-medium text-gray-700">
          Application Portal URL
        </label>
        <input
          type="url"
          id="applicationUrl"
          placeholder="https://..."
          value={formData.applicationUrl}
          onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="nextAction" className="block text-sm font-medium text-gray-700">
          Next Action
        </label>
        <input
          type="text"
          id="nextAction"
          placeholder="What should the student do next?"
          value={formData.nextAction}
          onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Application' : 'Create Application'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
