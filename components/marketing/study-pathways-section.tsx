/**
 * Study Pathways Section
 * PRD Section 10.3: 3 main study pathways
 * Shows Bachelor's, Master's, and Affordable options
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';

type Pathway = {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: string[];
  href: string;
};

type StudyPathwaysSectionProps = {
  locale: string;
};

export function StudyPathwaysSection({ locale }: StudyPathwaysSectionProps) {
  const pathways: Pathway[] = [
    {
      icon: <GraduationCap className="h-10 w-10" />,
      title: "Bachelor's Programs",
      description: "4-year undergraduate degrees at top U.S. universities. Perfect for high school graduates ready for a full American university experience.",
      highlights: [
        "Liberal arts education",
        "Campus life experience",
        "Optional Practical Training (OPT)"
      ],
      href: `/${locale}/study-usa#bachelors`
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Master's Programs",
      description: "1-2 year graduate programs to advance your career. Specialized training with strong ROI and excellent job prospects in the USA.",
      highlights: [
        "Specialized expertise",
        "STEM OPT extension available",
        "Career advancement focus"
      ],
      href: `/${locale}/study-usa#masters`
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Affordable Pathways",
      description: "Community colleges and pathway programs offering quality education at lower costs. Transfer to 4-year universities after 2 years.",
      highlights: [
        "Lower tuition costs",
        "Smaller class sizes",
        "Transfer to top universities"
      ],
      href: `/${locale}/study-usa#affordable`
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Study Pathways in the USA</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Whether you're starting your undergraduate journey, advancing your career with a Master's, or looking for affordable options—we've got you covered.
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {pathways.map((pathway, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-all hover:border-primary/50"
            >
              {/* Icon */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                {pathway.icon}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-2xl font-semibold">{pathway.title}</h3>

              {/* Description */}
              <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                {pathway.description}
              </p>

              {/* Highlights */}
              <ul className="mb-6 space-y-2">
                {pathway.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              {/* Learn More Link */}
              <Button asChild variant="outline" className="w-full">
                <Link href={pathway.href}>
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Not sure which pathway is right for you?{' '}
            <Link href={`/${locale}/assessment`} className="text-primary hover:underline font-medium">
              Take our free assessment
            </Link>{' '}
            to get personalized recommendations.
          </p>
        </div>
      </div>
    </section>
  );
}
