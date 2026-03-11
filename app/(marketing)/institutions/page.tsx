import { HeroSection } from "@/components/marketing/hero-section";
import { FeatureCard } from "@/components/marketing/feature-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, TrendingUp, Globe, Award, CheckCircle2 } from "lucide-react";

export default function InstitutionsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection
        variant="centered"
        subtitle="For US Universities"
        title="Partner With Study Frontier"
        description="Connect with highly qualified Moroccan students who are ready to succeed at your institution."
      />

      {/* Why Partner Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Partner With Us?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We send you well-prepared, motivated students who are ready to contribute to your campus community.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Quality Students"
              description="We thoroughly vet and prepare each student, ensuring they meet academic and financial requirements."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="High Retention"
              description="Our comprehensive preparation leads to better student outcomes and higher completion rates."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Market Expertise"
              description="Deep understanding of the Moroccan market and student needs helps us match the right students to your programs."
            />
            <FeatureCard
              icon={<Award className="h-6 w-6" />}
              title="Ongoing Support"
              description="We continue supporting students after enrollment, helping with cultural adjustment and academic success."
            />
          </div>
        </div>
      </section>

      {/* Our Students Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">The Moroccan Student Advantage</h2>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Moroccan students bring unique perspectives and strengths to American campuses:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    <strong>Multilingual:</strong> Most speak Arabic, French, and English, with many also speaking Berber dialects.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    <strong>Strong Academic Foundation:</strong> Moroccan education system emphasizes STEM and critical thinking.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    <strong>Cultural Bridge:</strong> Experience with both Western and Arab cultures makes them natural cultural ambassadors.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    <strong>Adaptable:</strong> Growing up in a diverse, multicultural society prepares them for global environments.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    <strong>Committed:</strong> Studying abroad represents a significant family investment, leading to high motivation and dedication.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Partnership Benefits</h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="mb-4 text-xl font-semibold">Streamlined Recruitment</h3>
              <p className="mb-4 text-muted-foreground">
                We handle initial screening, ensuring you only review qualified candidates who meet your admission criteria.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Pre-verified academic credentials</li>
                <li>• Confirmed English proficiency</li>
                <li>• Documented financial capability</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="mb-4 text-xl font-semibold">Market Intelligence</h3>
              <p className="mb-4 text-muted-foreground">
                Gain insights into the Moroccan market and student preferences to better position your programs.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Student demand trends</li>
                <li>• Competitor analysis</li>
                <li>• Pricing sensitivity data</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="mb-4 text-xl font-semibold">Enhanced Visibility</h3>
              <p className="mb-4 text-muted-foreground">
                Featured placement in our university database and direct promotion to qualified students.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Priority listing for partner schools</li>
                <li>• Participation in information sessions</li>
                <li>• Co-branded marketing materials</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="mb-4 text-xl font-semibold">Reduced Admin Burden</h3>
              <p className="mb-4 text-muted-foreground">
                We guide students through the application process, reducing incomplete or incorrect submissions.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Complete application packages</li>
                <li>• Accurate documentation</li>
                <li>• Timely submissions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">How Partnership Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Partnership Agreement</h3>
                  <p className="text-sm text-muted-foreground">
                    We establish a partnership outlining program details, admission requirements, and any special arrangements for our students.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Student Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    We identify qualified students who align with your programs and introduce them to your institution.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Application Support</h3>
                  <p className="text-sm text-muted-foreground">
                    We guide students through your application process, ensuring complete and accurate submissions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  4
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Enrollment & Beyond</h3>
                  <p className="text-sm text-muted-foreground">
                    Once admitted, we help students with visa preparation and pre-departure. We stay in touch to ensure smooth transition and success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground md:px-12 md:py-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Interested in Partnering?</h2>
            <p className="mb-8 text-lg opacity-90">
              Let's discuss how we can help you recruit qualified Moroccan students to your institution.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Contact Our Partnership Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
