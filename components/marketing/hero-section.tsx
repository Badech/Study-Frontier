import { ReactNode } from "react";
import { clsx } from "clsx";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  cta?: ReactNode;
  image?: string;
  variant?: "default" | "centered";
}

export function HeroSection({
  title,
  subtitle,
  description,
  cta,
  image,
  variant = "default",
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div
          className={clsx(
            "grid gap-8 lg:gap-12",
            variant === "centered" ? "text-center" : "lg:grid-cols-2 lg:items-center"
          )}
        >
          <div className={clsx("space-y-6", variant === "centered" && "mx-auto max-w-3xl")}>
            {subtitle && (
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {subtitle}
              </p>
            )}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">{description}</p>
            {cta && <div className={clsx("flex gap-4", variant === "centered" && "justify-center")}>{cta}</div>}
          </div>
          {image && variant !== "centered" && (
            <div className="relative aspect-square overflow-hidden rounded-2xl lg:aspect-auto lg:h-[500px]">
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
