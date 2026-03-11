/**
 * Client-side Visa Preparation Management Component
 * Sprint 07: DS-160 and Visa Workflow
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { VisaPreparation, MockInterviewStatus, VisaReadinessLevel } from '@/types';

interface VisaPrepManagementClientProps {
  visaPrepData: VisaPreparation;
  studentId: string;
  studentName: string;
  adminId: string;
}

export function VisaPrepManagementClient({
  visaPrepData,
  studentId,
  studentName,
  adminId,
}: VisaPrepManagementClientProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form state
  const [mockInterviewStatus, setMockInterviewStatus] = useState<MockInterviewStatus>(
    visaPrepData.mock_interview_status
  );
  const [lastMockInterviewDate, setLastMockInterviewDate] = useState(
    visaPrepData.last_mock_interview_date || ''
  );
  const [mockInterviewNotes, setMockInterviewNotes] = useState(
    visaPrepData.mock_interview_notes || ''
  );
  const [readinessLevel, setReadinessLevel] = useState<VisaReadinessLevel>(
    visaPrepData.readiness_level || 'not_ready'
  );
  const [interviewDate, setInterviewDate] = useState(visaPrepData.interview_date || '');
  const [interviewLocation, setInterviewLocation] = useState(visaPrepData.interview_location || '');
  const [adminNotes, setAdminNotes] = useState(visaPrepData.admin_notes || '');

  const handleUpdateVisaPrep = async () => {
    try {
      setIsUpdating(true);

      const response = await fetch('/api/visa-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          mock_interview_status: mockInterviewStatus,
          last_mock_interview_date: lastMockInterviewDate || null,
          mock_interview_notes: mockInterviewNotes,
          readiness_level: readinessLevel,
          interview_date: interviewDate || null,
          interview_location: interviewLocation,
          admin_notes: adminNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update visa preparation');
      }

      router.refresh();
      alert('Visa preparation updated successfully!');
    } catch (error) {
      console.error('Error updating visa prep:', error);
      alert('Failed to update visa preparation. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column - Mock Interview */}
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mock Interview Management</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mock Interview Status</label>
              <select
                value={mockInterviewStatus}
                onChange={(e) => setMockInterviewStatus(e.target.value as MockInterviewStatus)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="not_scheduled">Not Scheduled</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="needs_another">Needs Another Session</option>
                <option value="ready_for_interview">Ready for Interview</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Last Mock Interview Date</label>
              <input
                type="date"
                value={lastMockInterviewDate}
                onChange={(e) => setLastMockInterviewDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mock Interview Notes</label>
              <textarea
                value={mockInterviewNotes}
                onChange={(e) => setMockInterviewNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Add notes about the mock interview performance, areas to improve, etc."
              />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Overall Readiness</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Visa Readiness Level</label>
            <select
              value={readinessLevel}
              onChange={(e) => setReadinessLevel(e.target.value as VisaReadinessLevel)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="not_ready">Not Ready</option>
              <option value="in_progress">In Progress</option>
              <option value="nearly_ready">Nearly Ready</option>
              <option value="ready">Ready</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">
              This indicates the overall readiness of the student for their visa interview.
            </p>
          </div>
        </div>
      </div>

      {/* Right column - Interview Details & Notes */}
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actual Interview Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Interview Date</label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Interview Location</label>
              <input
                type="text"
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., U.S. Embassy - Casablanca"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Notes</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Internal Notes</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Internal notes about visa preparation, concerns, special circumstances, etc."
            />
            <p className="text-sm text-gray-500 mt-2">
              These notes are only visible to admins, not to the student.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="bg-white border rounded-lg p-6">
          <button
            onClick={handleUpdateVisaPrep}
            disabled={isUpdating}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
