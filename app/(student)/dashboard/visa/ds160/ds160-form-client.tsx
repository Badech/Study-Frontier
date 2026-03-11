/**
 * Client-side DS-160 Form Component
 * Sprint 07: DS-160 and Visa Workflow
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DS160Form } from '@/components/student/ds160-form';
import { DS160Progress } from '@/components/student/ds160-progress';
import type { DS160CompleteData } from '@/lib/validations/ds160';
import type { DS160Status } from '@/types';

interface DS160FormClientProps {
  initialData: Partial<DS160CompleteData>;
  studentId: string;
  ds160Id: string | null;
  currentStatus: DS160Status;
  completionPercentage: number;
  sectionsCompleted: string[];
  reviewNotes?: string | null;
}

export function DS160FormClient({
  initialData,
  studentId,
  ds160Id,
  currentStatus,
  completionPercentage,
  sectionsCompleted,
  reviewNotes,
}: DS160FormClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSave = async (formData: Partial<DS160CompleteData>) => {
    try {
      const response = await fetch('/api/ds160', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_data: formData }),
      });

      if (!response.ok) {
        throw new Error('Failed to save DS-160 data');
      }

      const result = await response.json();
      
      // Refresh the page to update progress
      router.refresh();
    } catch (error) {
      console.error('Error saving DS-160:', error);
      throw error;
    }
  };

  const handleSubmitForReview = async () => {
    if (!ds160Id) {
      setSubmitError('Please save your form first before submitting for review');
      return;
    }

    if (completionPercentage < 80) {
      setSubmitError('Please complete at least 80% of the form before submitting for review');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await fetch(`/api/ds160/${ds160Id}/submit`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit for review');
      }

      // Refresh to show updated status
      router.refresh();
      alert('DS-160 submitted for review successfully! An admin will review it shortly.');
    } catch (error: any) {
      console.error('Error submitting DS-160:', error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmitForReview = 
    currentStatus === 'draft' || 
    currentStatus === 'needs_correction';

  const isApproved = 
    currentStatus === 'approved' || 
    currentStatus === 'ready_for_submission';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form - 2 columns on large screens */}
        <div className="lg:col-span-2">
          {/* Show review notes if needs correction */}
          {currentStatus === 'needs_correction' && reviewNotes && (
            <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">
                ⚠️ Corrections Needed
              </h3>
              <p className="text-sm text-orange-800 whitespace-pre-wrap">{reviewNotes}</p>
            </div>
          )}

          {/* Show approval message */}
          {isApproved && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">
                ✅ DS-160 Approved
              </h3>
              <p className="text-sm text-green-800">
                Your DS-160 information has been reviewed and approved. You can now proceed to submit 
                your DS-160 on the official U.S. government website. We will guide you through this process.
              </p>
            </div>
          )}

          {/* Form is read-only if submitted for review or approved */}
          {(currentStatus === 'submitted_for_review' || isApproved) ? (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">DS-160 Form (Read-Only)</h2>
              <p className="text-gray-600 mb-4">
                Your form is currently {currentStatus === 'submitted_for_review' ? 'under review' : 'approved'}. 
                You cannot make changes at this time.
              </p>
              {/* TODO: Show read-only view of form data */}
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(initialData, null, 2)}
              </pre>
            </div>
          ) : (
            <DS160Form
              initialData={initialData}
              studentId={studentId}
              ds160Id={ds160Id}
              onSave={handleSave}
            />
          )}
        </div>

        {/* Sidebar - progress and actions */}
        <div className="space-y-6">
          {/* Progress card */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Progress</h3>
            <DS160Progress
              completionPercentage={completionPercentage}
              status={currentStatus}
              sectionsCompleted={sectionsCompleted}
            />
          </div>

          {/* Submit for review button */}
          {canSubmitForReview && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Ready to Submit?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Once you've completed at least 80% of the form, you can submit it for admin review.
              </p>
              
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <button
                onClick={handleSubmitForReview}
                disabled={isSubmitting || completionPercentage < 80}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </button>

              {completionPercentage < 80 && (
                <p className="text-xs text-gray-500 mt-2">
                  Complete at least 80% to submit
                </p>
              )}
            </div>
          )}

          {/* Help card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-800 mb-3">
              If you have questions about filling out the DS-160 form, contact your counselor.
            </p>
            <button className="text-sm text-blue-700 font-medium hover:underline">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
