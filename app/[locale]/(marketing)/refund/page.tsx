import { getTranslations } from 'next-intl/server';

export default async function RefundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">1. Overview</h2>
            <p className="text-muted-foreground">
              At Study Frontier, we are committed to providing high-quality educational consulting services. This Refund Policy outlines the terms and conditions for refunds of service fees.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">2. Non-Refundable Services</h2>
            <p className="text-muted-foreground">The following are non-refundable:</p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Initial consultation fees</li>
              <li>Assessment and evaluation fees</li>
              <li>Services already rendered or completed</li>
              <li>Third-party fees (application fees, test fees, etc.)</li>
              <li>Document review and editing services once delivered</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">3. Partial Refund Eligibility</h2>
            <p className="text-muted-foreground">
              You may be eligible for a partial refund in the following circumstances:
            </p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li><strong>Within 14 days of service agreement:</strong> If you cancel within 14 days and services have not yet begun, you may receive a 75% refund</li>
              <li><strong>Before key milestones:</strong> If you cancel before major deliverables, a prorated refund based on services rendered may be available</li>
              <li><strong>Service quality issues:</strong> If agreed-upon services were not delivered as promised, a partial or full refund may be considered</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">4. No Refund for External Outcomes</h2>
            <p className="text-muted-foreground">
              Refunds are not provided based on:
            </p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>University admission decisions (acceptances or rejections)</li>
              <li>Visa application outcomes</li>
              <li>Scholarship or financial aid decisions</li>
              <li>Test scores or academic performance</li>
              <li>Changes in personal circumstances or plans</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Study Frontier provides guidance and support but cannot control or guarantee outcomes from universities, visa authorities, or other external entities.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">5. Refund Request Process</h2>
            <p className="text-muted-foreground">To request a refund:</p>
            <ol className="mt-2 space-y-2 text-muted-foreground">
              <li>1. Submit a written refund request to refunds@studyfrontier.com</li>
              <li>2. Include your service agreement number and reason for refund</li>
              <li>3. Provide any supporting documentation</li>
              <li>4. Allow 10-15 business days for review</li>
              <li>5. Approved refunds will be processed within 30 days</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">6. Payment Plan Cancellations</h2>
            <p className="text-muted-foreground">
              If you are on a payment plan and wish to cancel:
            </p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>You are responsible for payment of all services rendered up to the cancellation date</li>
              <li>Remaining payments will be cancelled once outstanding balances are settled</li>
              <li>Early cancellation may result in adjusted fees based on services completed</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">7. Service Suspension or Termination by Study Frontier</h2>
            <p className="text-muted-foreground">
              We reserve the right to terminate services if:
            </p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Payment obligations are not met</li>
              <li>Client provides false or misleading information</li>
              <li>Client engages in abusive or inappropriate behavior</li>
              <li>Client fails to meet agreed-upon responsibilities</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              In such cases, fees for services rendered up to termination are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">8. Refund Method</h2>
            <p className="text-muted-foreground">
              Approved refunds will be issued using the original payment method. Processing time may vary depending on your bank or payment provider.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">9. Dispute Resolution</h2>
            <p className="text-muted-foreground">
              If you disagree with a refund decision, you may request a review by our management team. The decision following this review will be final.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Refund Policy from time to time. Changes will be posted on this page with an updated revision date. Your service agreement will be governed by the policy in effect at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">11. Contact Us</h2>
            <p className="text-muted-foreground">
              For questions about this Refund Policy or to submit a refund request, please contact us at:
            </p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Email: Contact@studyfrontier.com</li>
              <li>Phone: +57 16904684</li>
              <li>Address: Washington DC, USA</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
