import { HeroSection } from "@/components/marketing/hero-section";
import { FeatureCard } from "@/components/marketing/feature-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Users, Globe, Trophy, DollarSign, Building } from "lucide-react";

export default function StudyUSAPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection
        variant="centered"
        subtitle="Study in the USA"
        title="Why American Universities?"
        description="Discover the benefits of pursuing higher education in the United States and learn what makes the American system unique."
      />

      {/* Why USA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">The American Advantage</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              The USA is home to the world's most prestigious universities and offers unmatched academic flexibility.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Trophy className="h-6 w-6" />}
              title="World-Class Universities"
              description="Over 4,000 accredited institutions, including many ranked among the top globally."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Academic Flexibility"
              description="Liberal arts system lets you explore different subjects before declaring a major."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Diverse Community"
              description="Study alongside students from every corner of the world in a multicultural environment."
            />
            <FeatureCard
              icon={<Building className="h-6 w-6" />}
              title="Research Opportunities"
              description="Access to cutting-edge facilities and research programs in every field."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Global Recognition"
              description="US degrees are respected worldwide and open doors to international careers."
            />
            <FeatureCard
              icon={<DollarSign className="h-6 w-6" />}
              title="Scholarship Options"
              description="Many universities offer financial aid and scholarships to international students."
            />
          </div>
        </div>
      </section>

      {/* Education System */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Understanding the US Education System</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold">Undergraduate Programs (Bachelor's Degree)</h3>
                <p className="text-muted-foreground">
                  Typically 4 years of study. Students take general education courses in their first two years before 
                  specializing in a major. This flexibility allows you to explore different fields before committing.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold">Graduate Programs (Master's & PhD)</h3>
                <p className="text-muted-foreground">
                  Master's programs usually take 1-2 years. PhD programs are research-intensive and can take 4-6 years. 
                  Many graduate programs offer teaching or research assistantships with tuition waivers.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold">Community Colleges</h3>
                <p className="text-muted-foreground">
                  A cost-effective pathway: complete your first 2 years at a community college, then transfer to a 
                  4-year university. This can significantly reduce overall costs while still earning a degree from a top university.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Universities */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Types of US Universities</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Each type offers unique benefits. We help you find the right fit for your goals.
            </p>
          </div>
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="mb-3 text-2xl font-semibold">Public Universities</h3>
              <p className="mb-4 text-muted-foreground">
                State-funded institutions offering quality education at relatively lower tuition. Large campuses with 
                diverse programs and extensive research facilities.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Examples:</strong> UC Berkeley, University of Michigan, University of Texas
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="mb-3 text-2xl font-semibold">Private Universities</h3>
              <p className="mb-4 text-muted-foreground">
                Privately funded with generally higher tuition but often more generous financial aid for international 
                students. Smaller class sizes and more personalized attention.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Examples:</strong> Harvard, Stanford, MIT, Duke
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="mb-3 text-2xl font-semibold">Liberal Arts Colleges</h3>
              <p className="mb-4 text-muted-foreground">
                Focus on undergraduate education with emphasis on broad learning across disciplines. Small class sizes, 
                close faculty interaction, and strong sense of community.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Examples:</strong> Williams College, Amherst, Swarthmore
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Costs and Funding */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Understanding Costs & Financial Aid</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-xl font-semibold">Typical Annual Costs</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Public Universities:</strong> ,000 - ,000 (tuition + living)</li>
                  <li>• <strong>Private Universities:</strong> ,000 - ,000 (tuition + living)</li>
                  <li>• <strong>Community Colleges:</strong> ,000 - ,000 (tuition + living)</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold">Financial Aid Options</h3>
                <p className="mb-4 text-muted-foreground">
                  Many universities offer merit-based scholarships, need-based aid, or graduate assistantships. 
                  We help you identify schools with strong financial aid programs for international students.
                </p>
                <p className="text-muted-foreground">
                  <strong>Important:</strong> Unlike loans, scholarships and grants don't need to be repaid. We guide 
                  you through the application process to maximize your chances of receiving aid.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Visa */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">F-1 Student Visa</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              The F-1 visa is the most common visa for international students. Here's what you need to know:
            </p>
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <div>
                <h3 className="mb-2 font-semibold">Work Authorization</h3>
                <p className="text-sm text-muted-foreground">
                  F-1 students can work on-campus up to 20 hours/week during studies and full-time during breaks. 
                  After graduation, you're eligible for Optional Practical Training (OPT) to work for 12 months 
                  (36 months for STEM fields).
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Dependents</h3>
                <p className="text-sm text-muted-foreground">
                  Your spouse and children can accompany you on F-2 dependent visas, though they cannot work.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Processing Time</h3>
                <p className="text-sm text-muted-foreground">
                  Visa processing typically takes 2-4 weeks after your interview. We recommend applying at least 
                  3 months before your program start date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground md:px-12 md:py-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Explore Your Options?</h2>
            <p className="mb-8 text-lg opacity-90">
              Let's discuss which US universities align with your academic goals and budget.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
