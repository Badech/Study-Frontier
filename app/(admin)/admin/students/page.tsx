/**
 * Admin Students Management Page
 * Sprint 05: Admin Dashboard
 * 
 * View and manage students by stage
 */

import { getStudentsByStage } from '@/lib/data/admin';
import { StudentsTable } from '@/components/admin/students-table';
import { Card } from '@/components/ui/card';

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: { stage?: string };
}) {
  const stage = searchParams.stage;
  const { students, total } = await getStudentsByStage(stage, { limit: 100 });

  const stageLabels: Record<string, string> = {
    assessment: 'Assessment',
    planning: 'Planning',
    documents: 'Documents',
    applications: 'Applications',
    visa_preparation: 'Visa Preparation',
    pre_departure: 'Pre-Departure',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">
            {stage ? `${stageLabels[stage]} stage` : 'All active students'}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {total} students
        </div>
      </div>

      {/* Stage Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/admin/students"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              !stage
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All Stages
          </a>
          {Object.entries(stageLabels).map(([key, label]) => (
            <a
              key={key}
              href={`/admin/students?stage=${key}`}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                stage === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </Card>

      {/* Students Table */}
      <StudentsTable students={students} />
    </div>
  );
}
