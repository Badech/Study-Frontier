/**
 * Admin Stat Card Component
 * Sprint 05: Admin Dashboard
 * Displays a metric with optional trend indicator
 */

import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  href?: string;
}

export function StatCard({ title, value, icon: Icon, trend, description, href }: StatCardProps) {
  const CardContent = (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground" aria-label={`${title}: ${value}`}>{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`} aria-label={`Trend: ${trend.isPositive ? 'up' : 'down'} ${Math.abs(trend.value)} percent`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
        )}
      </div>
    </Card>
  );

  if (href) {
    return (
      <a href={href} className="block" aria-label={`View ${title}`}>
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
