/**
 * Admin Students Page
 * Sprint 05: Admin Dashboard - Student Management
 */

import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { getStudentsByStage } from '@/lib/data/admin';
import { StudentsTable } from '@/components/admin/students-table';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminStudentsPage() {
  const profile = await getUserProfile();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'counselor')) {
    redirect('/login');
  }

  // Fetch students
  const studentsData = await getStudentsByStage(undefined, { limit: 100 });
  const students = studentsData.students || [];

  // Calculate stats by stage
  const stageCount = {
    assessment: students.filter(s => s.current_stage === 'assessment').length,
    planning: students.filter(s => s.current_stage === 'planning').length,
    documents: students.filter(s => s.current_stage === 'documents').length,
    applications: students.filter(s => s.current_stage === 'applications').length,
    visa_preparation: students.filter(s => s.current_stage === 'visa_preparation').length,
    pre_departure: students.filter(s => s.current_stage === 'pre_departure').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage active students and track their progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stage Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xl font-bold">{stageCount.assessment}</div>
          <div className="text-xs text-muted-foreground">Assessment</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xl font-bold">{stageCount.planning}</div>
          <div className="text-xs text-muted-foreground">Planning</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xl font-bold">{stageCount.documents}</div>
          <div className="text-xs text-muted-foreground">Documents</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xl font-bold">{stageCount.applications}</div>
          <div className="text-xs text-muted-foreground">Applications</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xl font-bold">{stageCount.visa_preparation}</div>
          <div className="text-xs text-muted-foreground">Visa Prep</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xl font-bold">{stageCount.pre_departure}</div>
          <div className="text-xs text-muted-foreground">Pre-Departure</div>
        </div>
      </div>

      {/* Students Table */}
      <StudentsTable students={students} />
    </div>
  );
}
