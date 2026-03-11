/**
 * Progress Card Component
 * Sprint 04: Visual progress tracker showing student journey stages
 */

import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { DashboardCard } from './dashboard-card';
import type { ProgressStage } from '@/types';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  stages: ProgressStage[];
}

export function ProgressCard({ stages }: ProgressCardProps) {
  const currentStage = stages.find(s => s.isCurrent);
  const completedCount = stages.filter(s => s.isComplete).length;
  const progressPercentage = Math.round((completedCount / stages.length) * 100);

  return (
    <DashboardCard
      title="Your Progress"
      subtitle={currentStage ? `Current stage: ${currentStage.label}` : 'Getting started'}
      icon={<ArrowRight className="h-5 w-5" />}
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-card-foreground">
              {completedCount} of {stages.length} stages completed
            </span>
            <span className="text-muted-foreground">
              {progressPercentage}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stages List */}
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <div
              key={stage.key}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg transition-colors',
                stage.isCurrent && 'bg-primary/5 border border-primary/20',
                !stage.isCurrent && 'border border-transparent'
              )}
            >
              {/* Stage Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {stage.isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : stage.isCurrent ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/40" />
                )}
              </div>

              {/* Stage Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h5 className={cn(
                    'font-medium text-sm',
                    stage.isCurrent && 'text-primary',
                    stage.isComplete && 'text-card-foreground',
                    !stage.isCurrent && !stage.isComplete && 'text-muted-foreground'
                  )}>
                    {stage.order}. {stage.label}
                  </h5>
                  {stage.isCurrent && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stage.description}
                </p>
              </div>

              {/* Connector Line (except for last item) */}
              {index < stages.length - 1 && (
                <div className="absolute left-[2.3rem] mt-8 h-6 w-0.5 bg-muted" />
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
