/**
 * Admin Tasks List Component
 * Sprint 05: Admin Dashboard
 * Displays tasks needing attention with priority indicators
 */

import { Card } from '@/components/ui/card';
import { TaskNeedingAttention } from '@/lib/data/admin';
import { AlertCircle, Clock, FileText, Calendar, AlertTriangle } from 'lucide-react';

interface TasksListProps {
  tasks: TaskNeedingAttention[];
}

const typeIcons = {
  document_review: FileText,
  overdue_task: AlertCircle,
  blocked_case: AlertTriangle,
  pending_payment: Clock,
  appointment_soon: Calendar,
};

const priorityColors = {
  urgent: 'border-l-4 border-l-red-600 bg-red-50',
  high: 'border-l-4 border-l-orange-500 bg-orange-50',
  medium: 'border-l-4 border-l-yellow-500 bg-yellow-50',
  low: 'border-l-4 border-l-blue-500 bg-blue-50',
};

export function TasksList({ tasks }: TasksListProps) {
  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No tasks needing attention</p>
        <p className="text-sm text-muted-foreground mt-2">Great work! Everything is up to date.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const Icon = typeIcons[task.type];
        const priorityClass = priorityColors[task.priority];

        return (
          <a
            key={task.id}
            href={task.linkUrl}
            className="block"
          >
            <Card className={`p-4 hover:shadow-md transition-shadow ${priorityClass}`}>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {task.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">{task.studentName}</span>
                    {task.dueDate && (
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </a>
        );
      })}
    </div>
  );
}
