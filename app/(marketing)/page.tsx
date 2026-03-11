import Link from "next/link";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeatureCard } from "@/components/marketing/feature-card";
import { Button } from "@/components/ui/button";
import { GraduationCap, FileCheck, Users, Globe, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection
        subtitle="Premium USA Study Consulting"
        title="Your Journey to American Universities Starts Here"
        description="Clear Process. No Confusion. We guide Moroccan students through every step of studying in the USA—from university selection to visa approval."
        cta={
          <>
            <Button asChild size="lg">
              <Link href="/contact">Start Your Journey</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/process">How It Works</Link>
            </Button>
          </>
        }
      />

      {/* Trust Indicators */}
      <section className="border-y border-border bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <div className="text-4xl font-bold text-primary">100+</div>
              <p className="mt-2 text-sm text-muted-foreground">Students Guided</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">50+</div>
              <p className="mt-2 text-sm text-muted-foreground">Partner Universities</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">95%</div>
              <p className="mt-2 text-sm text-muted-foreground">Visa Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose Study Frontier?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We combine human expertise with modern technology to provide a seamless, trustworthy experience.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<GraduationCap className="h-6 w-6" />}
              title="Expert Guidance"
              description="Experienced counselors who understand both the US education system and Moroccan student needs."
            />
            <FeatureCard
              icon={<FileCheck className="h-6 w-6" />}
              title="Clear Process"
              description="Step-by-step roadmap from initial assessment to pre-departure. No surprises, no confusion."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Personalized Support"
              description="One-on-one counseling tailored to your academic goals and financial situation."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="USA-First Focus"
              description="Specialized exclusively in US universities. Deep partnerships and insider knowledge."
            />
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Services</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Comprehensive support packages designed for every stage of your journey.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="mb-4 text-2xl font-semibold">University Selection</h3>
              <ul className="mb-6 space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Personalized university matching</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Application strategy planning</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Essay and SOP review</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/services">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-card p-8">
              <div className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Most Popular
              </div>
              <h3 className="mb-4 text-2xl font-semibold">Complete Journey</h3>
              <ul className="mb-6 space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">End-to-end application support</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Visa preparation and interview prep</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Pre-departure orientation</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/services">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="mb-4 text-2xl font-semibold">Visa Support</h3>
              <ul className="mb-6 space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">DS-160 form assistance</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Interview preparation</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Document verification</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/services">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground md:px-12 md:py-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Start Your Journey?</h2>
            <p className="mb-8 text-lg opacity-90">
              Schedule a free consultation to discuss your study abroad goals and see how we can help.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
