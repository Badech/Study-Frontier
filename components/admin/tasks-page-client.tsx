'use client';

/**
 * Tasks Page Client Component
 * Handles client-side interactions for tasks page
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TasksList } from '@/components/admin/tasks-list';
import { TaskCreateModal } from '@/components/admin/task-create-modal';
import { Plus, Filter } from 'lucide-react';

type TasksPageClientProps = {
  stats: {
    total: number;
    pending: number;
    in_progress: number;
    overdue: number;
  };
  tasks: any[];
};

export function TasksPageClient({ stats, tasks }: TasksPageClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mt-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-muted-foreground">Overdue</div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="mt-6">
        <TasksList tasks={tasks} />
      </div>

      {/* Create Task Modal */}
      <TaskCreateModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}
