/**
 * Client-side Visa Preparation Component
 * Sprint 07: DS-160 and Visa Workflow
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VisaChecklist } from '@/components/student/visa-checklist';
import type { VisaPreparation, Appointment } from '@/types';

interface VisaPreparationClientProps {
  visaPrep: VisaPreparation;
  appointments: Appointment[];
  studentId: string;
}

const MOCK_INTERVIEW_STATUS_CONFIG = {
  not_scheduled: { label: 'Not Scheduled', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  scheduled: { label: 'Scheduled', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  completed: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100' },
  needs_another: { label: 'Needs Another Session', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  ready_for_interview: { label: 'Ready for Interview', color: 'text-purple-700', bgColor: 'bg-purple-100' },
};

const READINESS_LEVEL_CONFIG = {
  not_ready: { label: 'Not Ready', color: 'text-red-700', bgColor: 'bg-red-100', progress: 25 },
  in_progress: { label: 'In Progress', color: 'text-yellow-700', bgColor: 'bg-yellow-100', progress: 50 },
  nearly_ready: { label: 'Nearly Ready', color: 'text-blue-700', bgColor: 'bg-blue-100', progress: 75 },
  ready: { label: 'Ready', color: 'text-green-700', bgColor: 'bg-green-100', progress: 100 },
};

export function VisaPreparationClient({
  visaPrep,
  appointments,
  studentId,
}: VisaPreparationClientProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const mockInterviewStatus = MOCK_INTERVIEW_STATUS_CONFIG[visaPrep.mock_interview_status];
  const readinessLevel = READINESS_LEVEL_CONFIG[visaPrep.readiness_level || 'not_ready'];

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.scheduled_at) > new Date() && 
    ['scheduled', 'confirmed'].includes(apt.status)
  );

  const pastAppointments = appointments.filter(apt => 
    new Date(apt.scheduled_at) <= new Date() || 
    apt.status === 'completed'
  );

  const handleChecklistToggle = async (itemId: string, completed: boolean) => {
    try {
      setIsUpdating(true);
      
      // Update checklist items
      const currentItems = Array.isArray(visaPrep.checklist_items) ? visaPrep.checklist_items : [];
      const updatedItems = currentItems.map((item: any) =>
        item.id === itemId ? { ...item, completed } : item
      );

      const response = await fetch('/api/visa-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          checklist_items: updatedItems,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update checklist');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating checklist:', error);
      alert('Failed to update checklist. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content - 2 columns */}
      <div className="lg:col-span-2 space-y-6">
        {/* Visa Checklist */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Visa Document Checklist</h2>
          <VisaChecklist
            items={Array.isArray(visaPrep.checklist_items) ? visaPrep.checklist_items : []}
            onItemToggle={handleChecklistToggle}
            readOnly={isUpdating}
          />
        </div>

        {/* Mock Interview History */}
        {pastAppointments.length > 0 && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mock Interview History</h2>
            <div className="space-y-3">
              {pastAppointments.map((apt) => (
                <div key={apt.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{apt.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(apt.scheduled_at).toLocaleDateString()} at{' '}
                        {new Date(apt.scheduled_at).toLocaleTimeString()}
                      </p>
                      {apt.student_notes && (
                        <p className="text-sm text-gray-700 mt-2">{apt.student_notes}</p>
                      )}
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interview Details */}
        {visaPrep.interview_date && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Visa Interview Appointment</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <p className="text-lg font-semibold">
                  {new Date(visaPrep.interview_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {visaPrep.interview_location && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-base">{visaPrep.interview_location}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Overall Readiness */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Overall Readiness</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${readinessLevel.bgColor} ${readinessLevel.color}`}>
                  {readinessLevel.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${readinessLevel.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Interview Status */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Mock Interview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${mockInterviewStatus.bgColor} ${mockInterviewStatus.color}`}>
                {mockInterviewStatus.label}
              </span>
            </div>

            {visaPrep.last_mock_interview_date && (
              <div>
                <label className="text-sm font-medium text-gray-700">Last Session</label>
                <p className="text-sm text-gray-600">
                  {new Date(visaPrep.last_mock_interview_date).toLocaleDateString()}
                </p>
              </div>
            )}

            {visaPrep.mock_interview_notes && (
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {visaPrep.mock_interview_notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Upcoming Sessions</h3>
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="border-l-4 border-blue-500 pl-3">
                  <h4 className="font-medium text-sm">{apt.title}</h4>
                  <p className="text-xs text-gray-600">
                    {new Date(apt.scheduled_at).toLocaleDateString()} at{' '}
                    {new Date(apt.scheduled_at).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Visa Coaching */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Book Visa Coaching</h3>
          <p className="text-sm text-blue-800 mb-4">
            Schedule a mock interview or visa coaching session with your counselor.
          </p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Schedule Session
          </button>
        </div>
      </div>
    </div>
  );
}
