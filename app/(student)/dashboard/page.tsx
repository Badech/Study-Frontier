/**
 * Student Dashboard Page
 * Sprint 04: Complete student dashboard with all core sections
 * 
 * Mobile-first, action-oriented dashboard that shows:
 * 1. Next Action Required (highest priority)
 * 2. Missing Documents
 * 3. Progress Timeline
 * 4. Upcoming Appointments
 * 5. Recent Updates
 */

import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { getStudentDashboardData, getProgressStages } from '@/lib/data/student';
import { NextActionCard } from '@/components/student/next-action-card';
import { MissingDocumentsCard } from '@/components/student/missing-documents-card';
import { ProgressCard } from '@/components/student/progress-card';
import { AppointmentsCard } from '@/components/student/appointments-card';
import { RecentUpdatesCard } from '@/components/student/recent-updates-card';

export default async function StudentDashboardPage() {
  // Get authenticated user
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login?redirect=/dashboard');
  }

  // Fetch all dashboard data
  const dashboardData = await getStudentDashboardData(profile.id);

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome to your student portal
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Unable to load dashboard data. Please contact support if this persists.
          </p>
        </div>
      </div>
    );
  }

  const { student, nextAction, missingDocuments, upcomingAppointments, recentMessages } = dashboardData;
  const progressStages = getProgressStages(student.current_stage);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Welcome back, {profile.full_name || 'Student'}
        </p>
      </div>

      {/* Dashboard Grid - Mobile First */}
      <div className="space-y-6">
        {/* Section 1: Next Action (Full Width - Highest Priority) */}
        <NextActionCard task={nextAction} />

        {/* Section 2 & 3: Missing Documents and Progress (2-column on desktop) */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MissingDocumentsCard documents={missingDocuments} />
          <ProgressCard stages={progressStages} />
        </div>

        {/* Section 4 & 5: Appointments and Updates (2-column on desktop) */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AppointmentsCard appointments={upcomingAppointments} />
          <RecentUpdatesCard messages={recentMessages} />
        </div>
      </div>

      {/* Quick Stats Bar (Optional - shows key metrics) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-6 border-t border-border">
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold text-card-foreground">
            {progressStages.filter(s => s.isComplete).length}/{progressStages.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Stages Complete</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold text-card-foreground">
            {missingDocuments.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Pending Documents</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold text-card-foreground">
            {upcomingAppointments.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Upcoming Appointments</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-2xl font-bold text-card-foreground">
            {dashboardData.applicationsSummary.total}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Applications</p>
        </div>
      </div>
    </div>
  );
}
