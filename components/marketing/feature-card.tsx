import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  footer?: ReactNode;
}

export function FeatureCard({ icon, title, description, footer }: FeatureCardProps) {
  return (
    <Card variant="bordered" className="h-full transition-shadow hover:shadow-lg">
      <CardHeader>
        {icon && <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        {footer && <div className="mt-4">{footer}</div>}
      </CardContent>
    </Card>
  );
}
