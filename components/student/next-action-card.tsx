/**
 * Next Action Card Component
 * Sprint 04: Shows the most important action for the student
 * This is the highest priority element on the dashboard
 */

import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { DashboardCard } from './dashboard-card';
import type { Task } from '@/types';
import { format } from 'date-fns';

interface NextActionCardProps {
  task: Task | null;
}

export function NextActionCard({ task }: NextActionCardProps) {
  if (!task) {
    return (
      <DashboardCard
        title="Next Action Required"
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        priority="high"
      >
        <div className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <p className="text-base font-medium text-card-foreground">
            All caught up!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            No urgent actions at the moment. We&apos;ll notify you when something needs your attention.
          </p>
        </div>
      </DashboardCard>
    );
  }

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPriorityBadge = () => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[task.priority as keyof typeof colors] || colors.medium}`}>
        {task.priority?.toUpperCase() || 'MEDIUM'}
      </span>
    );
  };

  return (
    <DashboardCard
      title="Next Action Required"
      icon={getPriorityIcon()}
      priority="high"
      className="border-l-4 border-l-primary"
    >
      <div className="space-y-4">
        {/* Task Title and Priority */}
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-lg font-semibold text-card-foreground flex-1">
            {task.title}
          </h4>
          {getPriorityBadge()}
        </div>

        {/* Task Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Task Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {task.category && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium">Category:</span>
              <span className="capitalize">{task.category.replace('_', ' ')}</span>
            </div>
          )}
          {task.due_date && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Due {format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            Take Action
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}
