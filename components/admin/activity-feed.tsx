/**
 * Admin Activity Feed Component
 * Sprint 05: Admin Dashboard
 * Displays recent activity across all students
 */

import { Card } from '@/components/ui/card';
import { ActivityItem } from '@/lib/data/admin';
import { FileText, TrendingUp, Send, Calendar, DollarSign, CheckSquare } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const typeIcons = {
  document: FileText,
  stage_change: TrendingUp,
  application: Send,
  appointment: Calendar,
  payment: DollarSign,
  task: CheckSquare,
};

const typeColors = {
  document: 'bg-blue-100 text-blue-700',
  stage_change: 'bg-green-100 text-green-700',
  application: 'bg-purple-100 text-purple-700',
  appointment: 'bg-orange-100 text-orange-700',
  payment: 'bg-emerald-100 text-emerald-700',
  task: 'bg-slate-100 text-slate-700',
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No recent activity</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = typeIcons[activity.type];
          const colorClass = typeColors[activity.type];

          return (
            <div key={`${activity.type}-${activity.id}-${activity.timestamp}`} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.description} • {activity.studentName}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
