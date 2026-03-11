import { HeroSection } from "@/components/marketing/hero-section";
import { FeatureCard } from "@/components/marketing/feature-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Target, Heart, Lightbulb, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection
        variant="centered"
        subtitle="About Study Frontier"
        title="Your Trusted Partner in USA Education"
        description="We're a premium educational consulting service dedicated to helping Moroccan students achieve their dream of studying in the United States."
      />

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To provide clear, honest, and comprehensive guidance to Moroccan students pursuing higher education in the USA. We eliminate confusion and uncertainty by offering a structured, transparent process backed by expert knowledge and genuine care.
              </p>
            </div>
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h2 className="mb-4 text-3xl font-bold">Our Vision</h2>
              <p className="text-lg text-muted-foreground">
                To be the most trusted name in USA study abroad consulting for Moroccan students, known for our integrity, expertise, and commitment to student success. We envision a future where every qualified Moroccan student has access to world-class American education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Our Story</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Study Frontier was founded by educators and consultants who experienced firsthand the challenges Moroccan students face when applying to US universities. We saw too many talented students struggle with incomplete information, confusing processes, and unreliable guidance.
              </p>
              <p>
                We built Study Frontier to be different. Our approach is simple: clear processes, honest advice, and unwavering support. We don't make false promises or guarantee admissions—instead, we provide expert guidance and help students present their best, authentic selves.
              </p>
              <p>
                Today, we're proud to have helped hundreds of students achieve their dreams of studying in America, with a track record of successful placements at top universities across the United States.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Core Values</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              These principles guide everything we do.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Heart className="h-6 w-6" />}
              title="Student-First"
              description="Every decision we make prioritizes student success and wellbeing over profit."
            />
            <FeatureCard
              icon={<Award className="h-6 w-6" />}
              title="Transparency"
              description="Clear pricing, honest assessments, and realistic expectations. No hidden fees or surprises."
            />
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="Excellence"
              description="We maintain the highest standards in everything from counseling to documentation."
            />
            <FeatureCard
              icon={<Lightbulb className="h-6 w-6" />}
              title="Innovation"
              description="We blend traditional expertise with modern technology to deliver superior service."
            />
          </div>
        </div>
      </section>

      {/* Why USA Focus */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Why USA-First?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              We specialize exclusively in US universities because deep expertise matters. Rather than being generalists covering multiple countries, we've built unparalleled knowledge of the American education system, visa processes, and university partnerships.
            </p>
            <p className="text-lg text-muted-foreground">
              This focused approach means better outcomes for our students—we know the nuances, have insider relationships, and stay ahead of policy changes that affect Moroccan applicants.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground md:px-12 md:py-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Begin?</h2>
            <p className="mb-8 text-lg opacity-90">
              Let's discuss your goals and create a personalized roadmap to your dream university.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
