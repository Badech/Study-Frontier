import { HeroSection } from "@/components/marketing/hero-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, GraduationCap, FileText, Plane } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection
        variant="centered"
        subtitle="Our Services"
        title="Comprehensive Support for Your USA Journey"
        description="From initial assessment to pre-departure, we provide expert guidance at every step. Choose the package that fits your needs."
      />

      {/* Service Packages */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Service Packages</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Flexible options designed for different stages of your journey.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Package 1: Essentials */}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
              <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">Essentials</h3>
                <p className="text-muted-foreground">Perfect for self-guided students who need expert direction</p>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Initial eligibility assessment</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">University selection guidance (up to 5 schools)</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Profile evaluation and roadmap</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">2 counseling sessions</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Email support for 3 months</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>

            {/* Package 2: Complete Journey (Featured) */}
            <div className="flex flex-col rounded-2xl border-2 border-primary bg-card p-8 shadow-lg">
              <div className="mb-2 inline-block self-start rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Most Popular
              </div>
              <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">Complete Journey</h3>
                <p className="text-muted-foreground">End-to-end support from start to campus arrival</p>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Everything in Essentials, plus:</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Unlimited counseling sessions</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Application review and submission support</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Essay and SOP editing (up to 3 drafts)</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">DS-160 assistance and visa prep</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Mock visa interview sessions</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Pre-departure orientation</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Priority email & WhatsApp support</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>

            {/* Package 3: Visa Only */}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
              <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Plane className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">Visa Support</h3>
                <p className="text-muted-foreground">For students who already have an admission letter</p>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">DS-160 form guidance and review</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Document preparation checklist</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">2 mock visa interview sessions</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Financial documentation review</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">Pre-departure checklist</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">What You Can Expect</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              No matter which package you choose, you'll receive our signature level of care and expertise.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Honest Assessments</h3>
                <p className="text-sm text-muted-foreground">
                  We provide realistic evaluations of your profile and chances. No false promises or guarantees.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Personalized Strategy</h3>
                <p className="text-sm text-muted-foreground">
                  Every student is unique. We tailor our guidance to your academic background, goals, and budget.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Clear Communication</h3>
                <p className="text-sm text-muted-foreground">
                  Regular updates, transparent timelines, and responsive support throughout your journey.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                4
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Expert Guidance</h3>
                <p className="text-sm text-muted-foreground">
                  Our counselors have years of experience and deep knowledge of US admissions and visa processes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-On Services */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Add-On Services</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Additional support options available for all packages.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">Additional Essay Reviews</h3>
              <p className="text-sm text-muted-foreground">
                Need more essay feedback? Add unlimited reviews for your personal statements and supplemental essays.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">Parent/Sponsor Consultations</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated sessions to help parents understand the process, timeline, and financial requirements.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">Post-Arrival Support</h3>
              <p className="text-sm text-muted-foreground">
                Extended guidance for your first semester, including academic advising and cultural adjustment support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Not Sure Which Package to Choose?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Schedule a free consultation and we'll help you select the right level of support for your needs.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

