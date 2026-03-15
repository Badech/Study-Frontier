'use client';

/**
 * Student Actions Component
 * Client-side action handlers for student management
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, FileText } from 'lucide-react';

type StudentActionsProps = {
  studentId: string;
  studentEmail: string;
  studentName: string;
  studentPhone?: string;
  currentStage: string;
  locale: string;
};

export function StudentActions({ studentId, studentEmail, studentName, studentPhone, currentStage, locale }: StudentActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(currentStage);
  const [note, setNote] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    type: 'initial_consultation',
    date: '',
    time: '',
    duration: 60,
    notes: '',
  });

  const handleUpdateStage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/students/${studentId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_stage: selectedStage,
          notes: note || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to update stage');
      
      alert('Stage updated successfully!');
      setShowStageModal(false);
      router.refresh();
    } catch (error) {
      alert('Error updating stage');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) {
      alert('Please enter a note');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/students/${studentId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: note.trim() }),
      });

      if (!response.ok) throw new Error('Failed to add note');
      
      alert('Note added successfully!');
      setShowNoteModal(false);
      setNote('');
      router.refresh();
    } catch (error) {
      alert('Error adding note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleAppointment = async () => {
    if (!appointmentData.date || !appointmentData.time) {
      alert('Please select date and time');
      return;
    }

    setIsLoading(true);
    try {
      const scheduledAt = new Date(`${appointmentData.date}T${appointmentData.time}`).toISOString();
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          appointment_type: appointmentData.type,
          scheduled_at: scheduledAt,
          duration_minutes: appointmentData.duration,
          notes: appointmentData.notes || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to schedule appointment');
      
      alert('Appointment scheduled successfully!');
      setShowAppointmentModal(false);
      setAppointmentData({
        type: 'initial_consultation',
        date: '',
        time: '',
        duration: 60,
        notes: '',
      });
      router.refresh();
    } catch (error) {
      alert('Error scheduling appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <a href={`mailto:${studentEmail}?subject=Study Frontier - Student Update&body=Hi ${studentName},%0D%0A%0D%0A`}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </a>
        </Button>
        {studentPhone && (
          <Button variant="outline" asChild>
            <a href={`https://wa.me/${studentPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp
            </a>
          </Button>
        )}
        <Button 
          variant="outline"
          onClick={() => setShowAppointmentModal(true)}
          disabled={isLoading}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            setSelectedStage(currentStage);
            setNote('');
            setShowStageModal(true);
          }}
          disabled={isLoading}
        >
          Update Stage
        </Button>
        <Button 
          variant="outline"
          onClick={() => setShowNoteModal(true)}
          disabled={isLoading}
        >
          Add Note
        </Button>
        <Button variant="outline" asChild>
          <a href={`/${locale}/admin/documents?student=${studentId}`}>
            View Documents
          </a>
        </Button>
      </div>

      {/* Stage Update Modal */}
      {showStageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowStageModal(false)}>
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Update Student Stage</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">New Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                >
                  <option value="assessment">Assessment</option>
                  <option value="planning">Planning</option>
                  <option value="documents">Documents</option>
                  <option value="applications">Applications</option>
                  <option value="visa_preparation">Visa Preparation</option>
                  <option value="pre_departure">Pre-Departure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                  rows={3}
                  placeholder="Add any notes about this stage change..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleUpdateStage} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Stage'}
              </Button>
              <Button variant="outline" onClick={() => setShowStageModal(false)} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNoteModal(false)}>
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Add Admin Note</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                  rows={5}
                  placeholder="Enter your note about this student..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleAddNote} disabled={isLoading || !note.trim()}>
                {isLoading ? 'Saving...' : 'Save Note'}
              </Button>
              <Button variant="outline" onClick={() => setShowNoteModal(false)} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAppointmentModal(false)}>
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Schedule Appointment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Appointment Type</label>
                <select
                  value={appointmentData.type}
                  onChange={(e) => setAppointmentData({ ...appointmentData, type: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                >
                  <option value="initial_consultation">Initial Consultation</option>
                  <option value="document_review">Document Review</option>
                  <option value="visa_coaching">Visa Coaching</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <input
                    type="time"
                    value={appointmentData.time}
                    onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <select
                  value={appointmentData.duration}
                  onChange={(e) => setAppointmentData({ ...appointmentData, duration: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={appointmentData.notes}
                  onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                  rows={3}
                  placeholder="Add any notes about this appointment..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleScheduleAppointment} disabled={isLoading}>
                {isLoading ? 'Scheduling...' : 'Schedule'}
              </Button>
              <Button variant="outline" onClick={() => setShowAppointmentModal(false)} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
