import { ReactNode } from "react";
import { clsx } from "clsx";

interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
  icon?: ReactNode;
  isLast?: boolean;
}

export function ProcessStep({ step, title, description, icon, isLast }: ProcessStepProps) {
  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
          {icon || step}
        </div>
        {!isLast && <div className="mt-2 h-full w-0.5 bg-border" />}
      </div>
      <div className={clsx("pb-8", isLast && "pb-0")}>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
