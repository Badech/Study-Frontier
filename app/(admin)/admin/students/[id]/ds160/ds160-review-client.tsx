/**
 * Client-side DS-160 Review Component
 * Sprint 07: DS-160 and Visa Workflow
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DS160Progress } from '@/components/student/ds160-progress';
import type { DS160Data } from '@/types';

interface DS160ReviewClientProps {
  ds160Data: DS160Data & { reviewed_by_profile?: { full_name: string; email: string } };
  studentId: string;
  studentName: string;
  adminId: string;
}

export function DS160ReviewClient({
  ds160Data,
  studentId,
  studentName,
  adminId,
}: DS160ReviewClientProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewNotes, setReviewNotes] = useState(ds160Data.review_notes || '');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this DS-160? The student will be notified.')) {
      return;
    }

    try {
      setIsProcessing(true);

      const response = await fetch(`/api/ds160/${ds160Data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          review_notes: reviewNotes || 'Approved - ready for official submission',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve DS-160');
      }

      router.refresh();
      alert('DS-160 approved successfully!');
    } catch (error) {
      console.error('Error approving DS-160:', error);
      alert('Failed to approve DS-160. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestCorrection = async () => {
    if (!reviewNotes.trim()) {
      alert('Please provide feedback for the student about what needs to be corrected.');
      return;
    }

    if (!confirm('Request corrections from the student? They will be able to edit their form.')) {
      return;
    }

    try {
      setIsProcessing(true);

      const response = await fetch(`/api/ds160/${ds160Data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'needs_correction',
          review_notes: reviewNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to request corrections');
      }

      router.refresh();
      alert('Correction request sent to student.');
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error requesting corrections:', error);
      alert('Failed to request corrections. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const canReview = ds160Data.status === 'submitted_for_review';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content - DS-160 data display */}
      <div className="lg:col-span-2 space-y-6">
        {/* Form data viewer */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">DS-160 Form Data</h2>
          
          {/* Personal Information */}
          {ds160Data.form_data.personal && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(ds160Data.form_data.personal).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <div key={key}>
                      <label className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <p className="text-base">{String(value)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Travel Information */}
          {ds160Data.form_data.travel && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 border-b pb-2">Travel Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(ds160Data.form_data.travel).map(([key, value]) => {
                  if (value === null || value === undefined) return null;
                  return (
                    <div key={key}>
                      <label className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <p className="text-base">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Raw JSON view */}
          <details className="mt-6">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
              View Complete Form Data (JSON)
            </summary>
            <pre className="mt-3 bg-gray-50 p-4 rounded text-xs overflow-auto max-h-96 border">
              {JSON.stringify(ds160Data.form_data, null, 2)}
            </pre>
          </details>
        </div>

        {/* Review history */}
        {ds160Data.reviewed_at && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Review History</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Last reviewed by:</span>{' '}
                {ds160Data.reviewed_by_profile?.full_name || 'Unknown'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Date:</span>{' '}
                {new Date(ds160Data.reviewed_at).toLocaleString()}
              </div>
              {ds160Data.review_notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded border">
                  <span className="font-medium text-sm">Previous Notes:</span>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{ds160Data.review_notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - actions and progress */}
      <div className="space-y-6">
        {/* Progress */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Progress</h3>
          <DS160Progress
            completionPercentage={ds160Data.completion_percentage}
            status={ds160Data.status}
            sectionsCompleted={ds160Data.sections_completed || []}
          />
        </div>

        {/* Review actions */}
        {canReview && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Review Actions</h3>
            
            <div className="space-y-4">
              {/* Review notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Review Notes / Feedback</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Add notes or feedback for the student..."
                />
              </div>

              {/* Approve button */}
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : '✓ Approve DS-160'}
              </button>

              {/* Request correction button */}
              <button
                onClick={handleRequestCorrection}
                disabled={isProcessing || !reviewNotes.trim()}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : '← Request Corrections'}
              </button>

              <p className="text-xs text-gray-500">
                Note: Requesting corrections will allow the student to edit their form again.
              </p>
            </div>
          </div>
        )}

        {/* Info card */}
        {!canReview && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Status: {ds160Data.status}</h3>
            <p className="text-sm text-blue-800">
              {ds160Data.status === 'draft' && 'Student is still working on their DS-160 form.'}
              {ds160Data.status === 'needs_correction' && 'Student is making corrections based on your feedback.'}
              {ds160Data.status === 'approved' && 'DS-160 has been approved and is ready for official submission.'}
              {ds160Data.status === 'ready_for_submission' && 'DS-160 is ready for the student to submit to the U.S. government.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
