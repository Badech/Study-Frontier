/**
 * How It Works Section
 * PRD Section 10.2: 4-step public process flow
 * Shows the journey from assessment to arrival
 */

import { CheckCircle, FileSearch, Send, Plane } from 'lucide-react';

type Step = {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
};

export function HowItWorksSection() {
  const steps: Step[] = [
    {
      number: 1,
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Eligibility Assessment",
      description: "Complete our detailed assessment form. We'll evaluate your profile, academic background, and goals to determine the best pathway for you."
    },
    {
      number: 2,
      icon: <FileSearch className="h-8 w-8" />,
      title: "Pathway & School Planning",
      description: "Receive personalized university recommendations based on your budget, academic fit, and career goals. We'll create a strategic application plan."
    },
    {
      number: 3,
      icon: <Send className="h-8 w-8" />,
      title: "Application Preparation",
      description: "Get expert guidance on essays, document preparation, and application submission. We review everything before it goes to universities."
    },
    {
      number: 4,
      icon: <Plane className="h-8 w-8" />,
      title: "Visa & Next Steps",
      description: "Prepare for your visa interview with coaching and document verification. We guide you through every step until you're ready to fly."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A clear, step-by-step process from initial assessment to your arrival in the USA. No confusion, just results.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              {/* Step Card */}
              <div className="rounded-xl border border-border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                {/* Step Number Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-bold text-muted-foreground/20">
                    {step.number}
                  </span>
                </div>

                {/* Step Content */}
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (hidden on mobile, shown on larger screens) */}
              {step.number < 4 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg
                    className="h-8 w-8 text-primary/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Ready to get started? Complete your free assessment in 5 minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
