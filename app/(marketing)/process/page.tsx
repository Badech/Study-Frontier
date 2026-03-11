import { HeroSection } from "@/components/marketing/hero-section";
import { ProcessStep } from "@/components/marketing/process-step";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardCheck, Search, FileText, Send, Plane, GraduationCap } from "lucide-react";

export default function ProcessPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection
        variant="centered"
        subtitle="Our Process"
        title="Clear Process. No Confusion."
        description="A transparent, step-by-step roadmap from your first consultation to arriving on campus. We guide you through every stage."
      />

      {/* Main Process Timeline */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Your Journey in 6 Stages</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Each stage has clear objectives, timelines, and deliverables. You'll always know what's next.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <ProcessStep
              step={1}
              icon={<ClipboardCheck className="h-5 w-5" />}
              title="Initial Assessment"
              description="We evaluate your academic profile, goals, budget, and timeline. You'll receive an honest assessment of your options and a personalized roadmap for your journey."
            />
            <ProcessStep
              step={2}
              icon={<Search className="h-5 w-5" />}
              title="Profile Building"
              description="Together, we strengthen your profile through strategic planning. This includes identifying relevant extracurriculars, test preparation guidance (SAT, GRE, TOEFL/IELTS), and building a compelling narrative."
            />
            <ProcessStep
              step={3}
              icon={<FileText className="h-5 w-5" />}
              title="Document Collection"
              description="We help you gather and organize all required documents: transcripts, recommendation letters, financial statements, and more. Our portal makes tracking easy."
            />
            <ProcessStep
              step={4}
              icon={<Send className="h-5 w-5" />}
              title="Applications"
              description="We guide you through university selection and application submission. This includes essay reviews, form completion support, and deadline management for 5-10 universities."
            />
            <ProcessStep
              step={5}
              icon={<Plane className="h-5 w-5" />}
              title="Visa Preparation"
              description="Once admitted, we help with DS-160 completion, financial documentation, visa interview preparation, and SEVIS fee payment. Mock interviews ensure you're confident and ready."
            />
            <ProcessStep
              step={6}
              icon={<GraduationCap className="h-5 w-5" />}
              title="Pre-Departure"
              description="Final preparation for your journey: accommodation guidance, travel planning, what to pack, cultural orientation, and connecting you with other Moroccan students at your university."
              isLast
            />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">Typical Timeline</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">12-18 Months Before Departure</h3>
                <p className="text-muted-foreground">
                  <strong>Stages 1-2:</strong> Initial assessment, profile building, standardized test preparation. 
                  This is the foundation of your application strength.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">8-12 Months Before Departure</h3>
                <p className="text-muted-foreground">
                  <strong>Stages 3-4:</strong> Document collection and application submission. Most undergraduate 
                  deadlines are November-January for fall admission. Graduate programs vary widely.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">4-8 Months Before Departure</h3>
                <p className="text-muted-foreground">
                  <strong>Stage 5:</strong> Visa preparation and interview. Start immediately after receiving your 
                  I-20 from the university. Embassy wait times vary, so early preparation is crucial.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">1-3 Months Before Departure</h3>
                <p className="text-muted-foreground">
                  <strong>Stage 6:</strong> Pre-departure preparation. Book flights, arrange accommodation, attend 
                  orientation, and finalize all logistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Makes Our Process Different?</h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Transparency First</h3>
              <p className="text-muted-foreground">
                You'll always know where you are in the process, what's next, and why. No hidden steps or surprise requirements.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Technology-Enabled</h3>
              <p className="text-muted-foreground">
                Our student portal gives you 24/7 access to your documents, progress tracking, and upcoming deadlines. 
                Parents can view progress too.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Human-Centered</h3>
              <p className="text-muted-foreground">
                While we use technology for efficiency, you'll always have access to experienced counselors who 
                understand your unique situation.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Honest Guidance</h3>
              <p className="text-muted-foreground">
                We don't guarantee admissions or visas—nobody can. We provide expert guidance to maximize your 
                chances while setting realistic expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">Common Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Can I start mid-process?</h3>
                <p className="text-muted-foreground">
                  Yes! If you've already completed some steps (like taking standardized tests or gathering documents), 
                  we can join you at any stage. We offer flexible packages for different needs.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">What if I get rejected from all universities?</h3>
                <p className="text-muted-foreground">
                  We create balanced application lists with reach, match, and safety schools to minimize this risk. 
                  If needed, we help you strengthen your profile and reapply the following year.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Do you guarantee visa approval?</h3>
                <p className="text-muted-foreground">
                  No one can guarantee visa approval—that decision rests solely with the US Embassy. However, our 
                  thorough preparation and mock interviews have contributed to a 95% approval rate for our students.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">How involved are my parents in the process?</h3>
                <p className="text-muted-foreground">
                  Parents have read-only access to the student portal and can attend specific milestone meetings. 
                  We believe students should lead their journey while keeping families informed.
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
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Start Your Journey?</h2>
            <p className="mb-8 text-lg opacity-90">
              Let's map out your personalized roadmap to studying in the USA.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Begin Your Assessment</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
