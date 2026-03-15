/**
 * Student Detail Page
 * Admin view of individual student's complete profile and progress
 */

import { redirect, notFound } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { StudentActions } from '@/components/admin/student-actions';
import { ArrowLeft, MapPin, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function StudentDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const profile = await getUserProfile();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'counselor')) {
    redirect(`/${locale}/login`);
  }

  // Fetch student data
  const supabase = await createClient();
  const { data: student, error } = await supabase
    .from('students')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', id)
    .single();

  if (error || !student) {
    notFound();
  }

  const studentProfile = Array.isArray(student.profile) ? student.profile[0] : student.profile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/admin/students`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Link>
        </Button>
      </div>

      {/* Student Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{student.full_name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {studentProfile?.email || 'No email'}
              </div>
              {studentProfile?.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {studentProfile.phone}
                </div>
              )}
              {student.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {student.city}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Current Stage</div>
            <div className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {student.current_stage?.replace(/_/g, ' ') || 'Assessment'}
            </div>
          </div>
        </div>
      </div>

      {/* Student Information Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Academic Information */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Academic Information</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Desired Study Level</div>
              <div className="font-medium">{student.desired_study_level || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Intended Major</div>
              <div className="font-medium">{student.intended_major || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">GPA / Average</div>
              <div className="font-medium">{student.gpa_average || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">English Level</div>
              <div className="font-medium">{student.english_level || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Application Details</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Preferred Destination</div>
              <div className="font-medium">{student.preferred_destination || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Desired Intake</div>
              <div className="font-medium">{student.desired_intake || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Budget Range</div>
              <div className="font-medium">{student.budget_range || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sponsor Type</div>
              <div className="font-medium">{student.sponsor_type || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Progress Tracking</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Current Stage</div>
              <div className="font-medium">{student.current_stage?.replace(/_/g, ' ') || 'Assessment'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Stage Updated</div>
              <div className="font-medium">
                {student.stage_updated_at ? new Date(student.stage_updated_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Qualification Label</div>
              <div className="font-medium">
                {student.qualification_label?.replace(/_/g, ' ') || 'None'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="font-medium">
                {new Date(student.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Prior Visa Refusal</div>
              <div className="font-medium">{student.prior_visa_refusal ? 'Yes' : 'No'}</div>
            </div>
            {student.nationality && (
              <div>
                <div className="text-sm text-muted-foreground">Nationality</div>
                <div className="font-medium">{student.nationality}</div>
              </div>
            )}
            {student.age && (
              <div>
                <div className="text-sm text-muted-foreground">Age</div>
                <div className="font-medium">{student.age}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goal Statement */}
      {student.goal_statement && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Goal Statement</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {student.goal_statement}
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <StudentActions 
          studentId={student.id}
          studentEmail={studentProfile?.email || ''}
          studentName={student.full_name}
          studentPhone={studentProfile?.phone}
          currentStage={student.current_stage || 'assessment'}
          locale={locale}
        />
      </div>
    </div>
  );
}
