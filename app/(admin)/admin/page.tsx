/**
 * Admin Dashboard Home Page
 * Sprint 05: Admin Dashboard
 * 
 * Action-first dashboard showing:
 * - Key metrics and stats
 * - Tasks needing attention
 * - Students by stage
 * - Upcoming appointments
 * - Recent activity
 */

import { 
  getAdminDashboardStats, 
  getTasksNeedingAttention,
  getStudentsByStage,
  getAdminAppointments,
  getRecentActivity,
} from '@/lib/data/admin';
import { StatCard } from '@/components/admin/stat-card';
import { TasksList } from '@/components/admin/tasks-list';
import { StudentsTable } from '@/components/admin/students-table';
import { AppointmentsList } from '@/components/admin/appointments-list';
import { ActivityFeed } from '@/components/admin/activity-feed';
import { UserPlus, Users, AlertCircle, CheckSquare, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch all dashboard data in parallel
  const [stats, tasks, studentsData, appointmentsData, activities] = await Promise.all([
    getAdminDashboardStats(),
    getTasksNeedingAttention(10),
    getStudentsByStage(undefined, { limit: 10 }),
    getAdminAppointments({ 
      status: 'scheduled',
      dateFrom: new Date().toISOString(),
      limit: 5 
    }),
    getRecentActivity(10),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Operations and student management
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="New Leads (7 days)"
          value={stats.newLeads}
          icon={UserPlus}
          href="/admin/leads"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon={Users}
          href="/admin/students"
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon={AlertCircle}
          description="Documents awaiting review"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={CheckSquare}
          href="/admin/tasks"
        />
      </div>

      {/* Students by Stage Distribution */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Students by Stage</h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard
            title="Assessment"
            value={stats.studentsByStage.assessment}
            href="/admin/students?stage=assessment"
          />
          <StatCard
            title="Planning"
            value={stats.studentsByStage.planning}
            href="/admin/students?stage=planning"
          />
          <StatCard
            title="Documents"
            value={stats.studentsByStage.documents}
            href="/admin/students?stage=documents"
          />
          <StatCard
            title="Applications"
            value={stats.studentsByStage.applications}
            href="/admin/students?stage=applications"
          />
          <StatCard
            title="Visa Prep"
            value={stats.studentsByStage.visa_preparation}
            href="/admin/students?stage=visa_preparation"
          />
          <StatCard
            title="Pre-Departure"
            value={stats.studentsByStage.pre_departure}
            href="/admin/students?stage=pre_departure"
          />
        </div>
      </div>

      {/* Tasks Needing Attention - Highest Priority */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Tasks Needing Attention</h2>
          <a href="/admin/tasks" className="text-sm text-primary hover:text-primary/80 font-medium">
            View All →
          </a>
        </div>
        <TasksList tasks={tasks} />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Students */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Students</h2>
            <a href="/admin/students" className="text-sm text-primary hover:text-primary/80 font-medium">
              View All →
            </a>
          </div>
          <StudentsTable students={studentsData.students} />
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Appointments</h2>
            <a href="/admin/appointments" className="text-sm text-primary hover:text-primary/80 font-medium">
              View All →
            </a>
          </div>
          <AppointmentsList appointments={appointmentsData.appointments} />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
}
