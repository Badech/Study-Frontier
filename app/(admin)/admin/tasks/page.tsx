/**
 * Admin Tasks Management Page
 * Sprint 05: Admin Dashboard
 * 
 * View and manage all tasks across students
 */

import { getTasksNeedingAttention } from '@/lib/data/admin';
import { TasksList } from '@/components/admin/tasks-list';

export const dynamic = 'force-dynamic';

export default async function AdminTasksPage() {
  const tasks = await getTasksNeedingAttention(50);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground mt-1">
          All tasks needing attention across students
        </p>
      </div>

      {/* Tasks List */}
      <TasksList tasks={tasks} />
    </div>
  );
}
