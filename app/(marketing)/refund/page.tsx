export default function RefundPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-bold">Refund Policy</h1>
        <p className="mb-8 text-muted-foreground">Last updated: March 11, 2026</p>

        <div className="prose prose-slate max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">1. Overview</h2>
            <p className="text-muted-foreground">
              This Refund Policy outlines the conditions under which Study Frontier may provide refunds for 
              consulting services. We strive to be fair and transparent in all refund matters.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">2. Refund Eligibility</h2>
            
            <h3 className="mb-2 text-xl font-semibold">2.1 Cooling-Off Period</h3>
            <p className="mb-4 text-muted-foreground">
              You may cancel your service agreement within 7 days of signing for a full refund, provided no 
              substantive services have been delivered.
            </p>

            <h3 className="mb-2 text-xl font-semibold">2.2 Service Not Delivered</h3>
            <p className="mb-4 text-muted-foreground">
              If Study Frontier fails to deliver agreed-upon services due to our fault, you are entitled to a 
              full or partial refund based on services not provided.
            </p>

            <h3 className="mb-2 text-xl font-semibold">2.3 Partial Refunds</h3>
            <p className="text-muted-foreground">
              If you terminate services mid-process, you may be eligible for a partial refund based on services 
              not yet delivered, minus any work already completed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">3. Non-Refundable Items</h2>
            <p className="mb-4 text-muted-foreground">
              The following are non-refundable under any circumstances:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>University application fees paid to institutions</li>
              <li>Standardized test fees (SAT, GRE, TOEFL, etc.)</li>
              <li>Visa application fees and SEVIS fees</li>
              <li>Document translation or courier services</li>
              <li>Third-party services procured on your behalf</li>
              <li>Work completed prior to cancellation request</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">4. No Refunds for Admission or Visa Outcomes</h2>
            <p className="mb-4 text-muted-foreground">
              <strong>Important:</strong> Refunds are NOT provided based on:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>University admission decisions (rejections or acceptances)</li>
              <li>Visa approval or denial</li>
              <li>Scholarship or financial aid outcomes</li>
              <li>Change of mind about studying abroad</li>
              <li>Personal circumstances that prevent you from proceeding</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Our fee is for consulting services provided, not for guaranteed outcomes. We provide expert 
              guidance, but final decisions rest with universities and government authorities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Refund Calculation</h2>
            <p className="mb-4 text-muted-foreground">
              Partial refunds are calculated based on:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Total service fee paid</li>
              <li>Minus completed service stages (based on our 6-stage process)</li>
              <li>Minus any non-refundable third-party expenses</li>
              <li>Minus a 15% administrative fee</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Each service stage represents approximately 16-17% of the total service value.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Refund Request Process</h2>
            <p className="mb-4 text-muted-foreground">To request a refund:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Submit a written refund request to refunds@studyfrontier.com</li>
              <li>Include your service agreement number and reason for refund</li>
              <li>We will review your request within 5 business days</li>
              <li>If approved, refunds are processed within 14 business days</li>
              <li>Refunds are issued to the original payment method</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">7. Service Suspension</h2>
            <p className="text-muted-foreground">
              If you need to pause services temporarily (e.g., to retake exams, defer applications), we may 
              offer service suspension for up to 6 months without refund. Contact us to discuss options.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">8. Disputes</h2>
            <p className="text-muted-foreground">
              If you disagree with a refund decision, you may request a review by our senior management. All 
              refund disputes will be handled in good faith with the goal of fair resolution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">9. Package-Specific Terms</h2>
            <p className="mb-4 text-muted-foreground">
              Specific refund terms may vary by service package:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Essentials Package:</strong> Refund eligibility ends after initial assessment and roadmap delivery</li>
              <li><strong>Complete Journey:</strong> Refunds calculated based on completed stages</li>
              <li><strong>Visa Support Only:</strong> No refunds after DS-160 review is completed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">10. Contact Us</h2>
            <p className="text-muted-foreground">
              For questions about this Refund Policy or to request a refund:
              <br />
              Email: refunds@studyfrontier.com
              <br />
              Phone: +212 6XX XXX XXX
              <br />
              Address: Casablanca, Morocco
            </p>
          </section>

          <section className="mb-8 rounded-lg border-l-4 border-primary bg-primary/5 p-6">
            <h3 className="mb-2 font-semibold">Our Commitment</h3>
            <p className="text-sm text-muted-foreground">
              While this policy outlines formal refund terms, we're committed to working with families to find 
              fair solutions. If you're facing genuine hardship or have concerns about our services, please 
              reach out to discuss options.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
