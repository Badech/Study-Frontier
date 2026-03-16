/**
 * Admin Tasks Page
 * Sprint 05: Admin Dashboard - Task Management
 */

import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { getTasksNeedingAttention } from '@/lib/data/admin';
import { TasksList } from '@/components/admin/tasks-list';
import { TasksPageClient } from '@/components/admin/tasks-page-client';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminTasksPage() {
  const profile = await getUserProfile();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'counselor')) {
    redirect('/login');
  }

  // Fetch all tasks
  const tasks = await getTasksNeedingAttention(100);

  // Calculate stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.type === 'overdue_task' || t.type === 'document_review').length,
    in_progress: tasks.filter(t => t.type === 'pending_payment').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            View and manage all pending tasks
          </p>
        </div>
      </div>

      {/* Client Content */}
      <TasksPageClient stats={stats} tasks={tasks} />
    </div>
  );
}
