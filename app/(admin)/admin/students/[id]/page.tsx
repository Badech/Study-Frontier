/**
 * Admin Student Detail Page
 * Sprint 05: Admin Dashboard
 * 
 * View individual student details, progress, and manage their case
 */

import { getStudentDetail } from '@/lib/data/admin';
import { Card } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, Tag } from 'lucide-react';

export default async function AdminStudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const studentData = await getStudentDetail(params.id);

  if (!studentData) {
    notFound();
  }

  const { student, documentsSummary, applicationsSummary, tasks, appointments } = studentData;

  const stageColors: Record<string, string> = {
    assessment: 'bg-blue-100 text-blue-700',
    planning: 'bg-cyan-100 text-cyan-700',
    documents: 'bg-yellow-100 text-yellow-700',
    applications: 'bg-orange-100 text-orange-700',
    visa_preparation: 'bg-purple-100 text-purple-700',
    pre_departure: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <a href="/admin/students" className="text-sm text-primary hover:text-primary/80">
            ← Back to Students
          </a>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{student.full_name}</h1>
        <p className="text-muted-foreground mt-1">{student.email}</p>
      </div>

      {/* Student Profile Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Profile Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{student.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
                <p className="font-medium">{student.whatsapp || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{student.city || 'Not provided'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Current Stage</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  stageColors[student.current_stage] || 'bg-gray-100 text-gray-700'
                }`}>
                  {student.current_stage.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
            {student.qualification_label && (
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Qualification Label</p>
                  <p className="font-medium">{student.qualification_label.replace(/_/g, ' ')}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Study Goal</p>
              <p className="font-medium">{student.desired_study_level || 'Not specified'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {student.intended_major || 'Major undecided'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Status Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Documents</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{documentsSummary.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Approved</span>
              <span className="font-medium text-green-600">{documentsSummary.approved}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Under Review</span>
              <span className="font-medium text-yellow-600">{documentsSummary.under_review}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Missing</span>
              <span className="font-medium text-red-600">{documentsSummary.missing}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Applications</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{applicationsSummary.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">In Preparation</span>
              <span className="font-medium">{applicationsSummary.in_preparation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submitted</span>
              <span className="font-medium text-blue-600">{applicationsSummary.submitted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accepted</span>
              <span className="font-medium text-green-600">{applicationsSummary.accepted}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tasks & Appointments</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending Tasks</span>
              <span className="font-medium">{tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Upcoming Appointments</span>
              <span className="font-medium">{appointments.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Admin Notes */}
      {student.internal_notes && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Internal Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {student.internal_notes}
          </p>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex gap-4 flex-wrap">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Update Stage
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
            Add Note
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
            Send Message
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
            Create Task
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Note: Interactive actions will be implemented in future sprints
        </p>
      </Card>
    </div>
  );
}
