'use client';

/**
 * Lead Actions Component
 * Client-side action handlers for lead management
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, Phone, CheckCircle, UserPlus, FileText } from 'lucide-react';

type LeadActionsProps = {
  leadId: string;
  leadEmail: string;
  leadName: string;
  leadWhatsapp?: string;
  currentStatus: string;
};

export function LeadActions({ leadId, leadEmail, leadName, leadWhatsapp, currentStatus }: LeadActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [note, setNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [selectedLabel, setSelectedLabel] = useState('');

  const handleMarkQualified = async () => {
    if (!confirm(`Mark ${leadName} as qualified?`)) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'qualified',
          qualification_label: 'high_potential',
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      alert('Lead marked as qualified!');
      router.refresh();
    } catch (error) {
      alert('Error updating lead status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToStudent = async () => {
    if (!confirm(`Convert ${leadName} to a student? This will create a student record.`)) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leads/${leadId}/convert`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Conversion failed:', data);
        throw new Error(data.error || 'Failed to convert');
      }
      
      alert('Lead converted to student successfully!');
      router.push(`/admin/students/${data.student.id}`);
    } catch (error: any) {
      console.error('Conversion error:', error);
      alert(`Error: ${error.message || 'Failed to convert lead'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          qualification_label: selectedLabel || undefined,
          admin_notes: note || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      alert('Status updated successfully!');
      setShowStatusModal(false);
      router.refresh();
    } catch (error) {
      alert('Error updating status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href={`mailto:${leadEmail}?subject=Study Frontier - Assessment Follow-up&body=Hi ${leadName},%0D%0A%0D%0AThank you for completing your eligibility assessment...`}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </a>
        </Button>
        {leadWhatsapp && (
          <Button variant="outline" asChild>
            <a href={`https://wa.me/${leadWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp
            </a>
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={handleMarkQualified}
          disabled={isLoading || currentStatus === 'qualified'}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as Qualified
        </Button>
        <Button 
          variant="outline" 
          onClick={handleConvertToStudent}
          disabled={isLoading || currentStatus === 'converted'}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Convert to Student
        </Button>
        <Button 
          variant="outline"
          onClick={() => setShowStatusModal(true)}
          disabled={isLoading}
        >
          Update Status
        </Button>
        <Button 
          variant="outline"
          onClick={() => setShowNoteModal(true)}
          disabled={isLoading}
        >
          <FileText className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowStatusModal(false)}>
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Update Lead Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="not_qualified">Not Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Qualification Label (Optional)</label>
                <select
                  value={selectedLabel}
                  onChange={(e) => setSelectedLabel(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                >
                  <option value="">None</option>
                  <option value="high_potential">High Potential</option>
                  <option value="needs_followup">Needs Follow-up</option>
                  <option value="budget_mismatch">Budget Mismatch</option>
                  <option value="not_qualified_yet">Not Qualified Yet</option>
                  <option value="visa_risk_profile">Visa Risk Profile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                  rows={3}
                  placeholder="Add any notes about this status change..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleUpdateStatus} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update'}
              </Button>
              <Button variant="outline" onClick={() => setShowStatusModal(false)} disabled={isLoading}>
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
                  rows={4}
                  placeholder="Enter your note here..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button 
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const response = await fetch(`/api/leads/${leadId}/status`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        status: currentStatus,
                        admin_notes: note,
                      }),
                    });
                    if (!response.ok) throw new Error('Failed');
                    alert('Note added!');
                    setShowNoteModal(false);
                    setNote('');
                    router.refresh();
                  } catch (error) {
                    alert('Error adding note');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading || !note.trim()}
              >
                {isLoading ? 'Saving...' : 'Save Note'}
              </Button>
              <Button variant="outline" onClick={() => setShowNoteModal(false)} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
