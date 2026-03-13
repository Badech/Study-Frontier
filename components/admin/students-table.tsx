/**
 * Admin Students Table Component
 * Sprint 05: Admin Dashboard
 * Displays students with stage and status information
 */

import { Card } from '@/components/ui/card';
import { StudentWithProfile } from '@/lib/data/admin';
import Link from 'next/link';

interface StudentsTableProps {
  students: StudentWithProfile[];
}

const stageColors = {
  assessment: 'bg-blue-100 text-blue-700',
  planning: 'bg-cyan-100 text-cyan-700',
  documents: 'bg-yellow-100 text-yellow-700',
  applications: 'bg-orange-100 text-orange-700',
  visa_preparation: 'bg-purple-100 text-purple-700',
  pre_departure: 'bg-green-100 text-green-700',
};

const labelColors = {
  high_potential: 'bg-emerald-100 text-emerald-700',
  needs_followup: 'bg-orange-100 text-orange-700',
  budget_mismatch: 'bg-red-100 text-red-700',
  not_qualified_yet: 'bg-slate-100 text-slate-700',
  visa_risk_profile: 'bg-yellow-100 text-yellow-700',
};

export function StudentsTable({ students }: StudentsTableProps) {
  if (students.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No students found</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Students list">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Study Goal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Current Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Label
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Stage Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{student.full_name}</div>
                  <div className="text-xs text-muted-foreground">{student.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{student.desired_study_level || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">{student.intended_major || 'Undecided'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    stageColors[student.current_stage as keyof typeof stageColors] || 'bg-gray-100 text-gray-700'
                  }`}>
                    {student.current_stage.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.qualification_label ? (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      labelColors[student.qualification_label as keyof typeof labelColors] || 'bg-gray-100 text-gray-700'
                    }`}>
                      {student.qualification_label.replace(/_/g, ' ')}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No label</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(student.stage_updated_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    href={`/admin/students/${student.id}`}
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    View Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
