/**
 * Packages Overview Section
 * PRD Section 10.4: 3 service packages without exact pricing
 * Shows value proposition for each package tier
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star } from 'lucide-react';

type Package = {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

type PackagesSectionProps = {
  locale: string;
};

export function PackagesSection({ locale }: PackagesSectionProps) {
  const packages: Package[] = [
    {
      name: "Starter Package",
      tagline: "Perfect for early-stage planning",
      description: "Get clarity on your options and create a solid foundation for your study abroad journey.",
      features: [
        "Initial profile assessment",
        "University matching consultation",
        "Pathway planning session",
        "Budget and timeline guidance",
        "Email support"
      ],
      cta: "Get Started"
    },
    {
      name: "Application Package",
      tagline: "Complete application support",
      description: "From university selection to application submission—we handle everything so you can focus on your future.",
      features: [
        "Everything in Starter Package",
        "Up to 5 university applications",
        "Essay and SOP review",
        "Document preparation support",
        "Application strategy planning",
        "Priority support"
      ],
      highlighted: true,
      cta: "Most Popular"
    },
    {
      name: "Visa Ready Package",
      tagline: "Complete journey to arrival",
      description: "The most comprehensive package—from first consultation to landing in the USA. Leave nothing to chance.",
      features: [
        "Everything in Application Package",
        "DS-160 form review",
        "Visa interview coaching",
        "Mock interview sessions",
        "Document verification",
        "Pre-departure orientation",
        "Dedicated counselor"
      ],
      cta: "Go Premium"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Service Packages</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Flexible packages designed for every stage of your journey. Choose the level of support that fits your needs.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`rounded-2xl border p-8 flex flex-col ${
                pkg.highlighted
                  ? 'border-primary border-2 shadow-lg relative'
                  : 'border-border bg-card'
              }`}
            >
              {/* Popular Badge */}
              {pkg.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Package Header */}
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold">{pkg.name}</h3>
                <p className="text-sm font-medium text-primary">{pkg.tagline}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="mb-8 flex-1 space-y-3">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                asChild
                className="w-full"
                variant={pkg.highlighted ? 'default' : 'outline'}
                size="lg"
              >
                <Link href={`/${locale}/assessment`}>
                  {pkg.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Pricing Note */}
        <div className="mt-12 rounded-xl bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="font-semibold text-foreground">Best-fit package recommended after profile assessment.</strong>
            {' '}We'll review your goals, timeline, and budget to suggest the right level of support for your unique situation.
            {' '}Pricing is transparent and discussed during your consultation.
          </p>
        </div>
      </div>
    </section>
  );
}
