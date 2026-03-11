/**
 * Document Review Card Component
 * Sprint 06: Admin interface for reviewing student documents
 */

'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components/ui/status-badge';
import type { DocumentWithUploads } from '@/types';
import { CheckCircle, XCircle, Eye, Download } from 'lucide-react';

interface DocumentReviewCardProps {
  document: DocumentWithUploads;
  studentName: string;
  onReviewComplete?: () => void;
}

export function DocumentReviewCard({ document, studentName, onReviewComplete }: DocumentReviewCardProps) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [feedback, setFeedback] = useState(document.admin_feedback || '');
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'needs_correction' | 'under_review'>('under_review');
  const [error, setError] = useState<string | null>(null);

  const currentUpload = document.uploads?.find(u => u.is_current);
  const canReview = document.status !== 'missing' && currentUpload;

  const handleReview = async () => {
    setIsReviewing(true);
    setError(null);

    try {
      const response = await fetch(`/api/documents/${document.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          adminFeedback: feedback || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Review failed');
      }

      onReviewComplete?.();
    } catch (error) {
      console.error('Review error:', error);
      setError(error instanceof Error ? error.message : 'Review failed');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleDownload = async () => {
    if (!currentUpload) return;

    try {
      const response = await fetch(`/api/documents/${document.id}/download`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = currentUpload.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download document');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            {document.display_name}
            {document.is_required && <span className="ml-1 text-red-500">*</span>}
          </h3>
          <p className="text-sm text-gray-600">Student: {studentName}</p>
          {document.description && (
            <p className="mt-1 text-sm text-gray-500">{document.description}</p>
          )}
        </div>
        <StatusBadge status={document.status} variant="document" />
      </div>

      {/* Current Upload */}
      {currentUpload ? (
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{currentUpload.file_name}</p>
              <p className="text-xs text-gray-500">
                Uploaded {new Date(currentUpload.uploaded_at).toLocaleDateString()} •{' '}
                Version {currentUpload.version}
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-md bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">No document uploaded yet</p>
        </div>
      )}

      {/* Review Interface */}
      {canReview && (
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Review Decision</label>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setSelectedStatus('approved')}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedStatus === 'approved'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CheckCircle className="mx-auto mb-1 h-5 w-5" />
                Approve
              </button>
              <button
                onClick={() => setSelectedStatus('needs_correction')}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedStatus === 'needs_correction'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <XCircle className="mx-auto mb-1 h-5 w-5" />
                Needs Correction
              </button>
              <button
                onClick={() => setSelectedStatus('under_review')}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedStatus === 'under_review'
                    ? 'border-yellow-600 bg-yellow-50 text-yellow-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="mx-auto mb-1 h-5 w-5" />
                Under Review
              </button>
            </div>
          </div>

          <div>
            <label htmlFor={`feedback-${document.id}`} className="block text-sm font-medium text-gray-700">
              Feedback for Student {selectedStatus === 'needs_correction' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={`feedback-${document.id}`}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Provide feedback to the student (required for corrections)"
            />
          </div>

          <button
            onClick={handleReview}
            disabled={isReviewing || (selectedStatus === 'needs_correction' && !feedback.trim())}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isReviewing ? 'Submitting...' : 'Submit Review'}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}

      {/* Previous Feedback */}
      {document.admin_feedback && document.reviewed_at && (
        <div className="mt-4 rounded-md bg-blue-50 p-3">
          <p className="text-sm font-medium text-blue-800">Previous Feedback:</p>
          <p className="mt-1 text-sm text-blue-700">{document.admin_feedback}</p>
          <p className="mt-1 text-xs text-blue-600">
            Reviewed {new Date(document.reviewed_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
