import { getTranslations } from 'next-intl/server';
import { CheckCircle2 } from 'lucide-react';

export default async function ProcessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  const steps = [
    {
      number: 1,
      title: "Initial Assessment",
      description: "We evaluate your academic background, goals, and preferences to create a personalized roadmap."
    },
    {
      number: 2,
      title: "Profile Building",
      description: "Strengthen your profile with strategic guidance on academics, extracurriculars, and test preparation."
    },
    {
      number: 3,
      title: "University Selection",
      description: "Identify the best-fit universities based on your profile, preferences, and career goals."
    },
    {
      number: 4,
      title: "Application Support",
      description: "Complete applications with expert guidance on essays, recommendations, and documentation."
    },
    {
      number: 5,
      title: "Visa Preparation",
      description: "Navigate the visa process with DS-160 assistance, interview prep, and document verification."
    },
    {
      number: 6,
      title: "Pre-Departure",
      description: "Get ready for your journey with orientation, travel planning, and settling-in support."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Our Process</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          A clear, step-by-step journey from your first consultation to landing in the USA. No confusion, no surprises.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex gap-6">
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-14 h-full w-0.5 bg-border" />
              )}
              
              {/* Step number */}
              <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {step.number}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-8">
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
