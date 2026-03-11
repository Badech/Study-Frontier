/**
 * Base Dashboard Card Component
 * Sprint 04: Reusable card wrapper for student dashboard sections
 * Mobile-first, clean design
 */

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
}

export function DashboardCard({
  title,
  subtitle,
  icon,
  children,
  action,
  className,
  priority = 'medium',
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        priority === 'high' && 'border-primary/30 ring-1 ring-primary/10',
        className
      )}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border p-4 sm:p-6">
        <div className="flex items-start gap-3">
          {icon && (
            <div className={cn(
              'mt-0.5 flex-shrink-0',
              priority === 'high' && 'text-primary'
            )}>
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-card-foreground">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
}
