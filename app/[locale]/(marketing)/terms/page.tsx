import { getTranslations } from 'next-intl/server';

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Terms & Conditions</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Study Frontier's services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">2. Services Provided</h2>
            <p className="text-muted-foreground">
              Study Frontier provides educational consulting services including, but not limited to:
            </p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>University selection and application guidance</li>
              <li>Document review and preparation assistance</li>
              <li>Visa application support and interview preparation</li>
              <li>Pre-departure orientation and guidance</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">3. Service Limitations</h2>
            <p className="text-muted-foreground">
              We provide guidance and support, but we do not guarantee:
            </p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Admission to any specific university or program</li>
              <li>Approval of visa applications</li>
              <li>Specific scholarship or financial aid awards</li>
              <li>Any particular outcome from the application process</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Final admission and visa decisions are made by universities and government authorities respectively.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">4. Client Responsibilities</h2>
            <p className="text-muted-foreground">As a client, you are responsible for:</p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Providing accurate and complete information</li>
              <li>Meeting all deadlines and requirements set by universities</li>
              <li>Paying all fees associated with applications, tests, and visas</li>
              <li>Maintaining regular communication with our team</li>
              <li>Making final decisions about university selection and applications</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">5. Payment Terms</h2>
            <p className="text-muted-foreground">
              Service fees are outlined in your individual service agreement. Payment terms include:
            </p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Initial consultation fees (if applicable) are non-refundable</li>
              <li>Service packages may require upfront payment or installment plans</li>
              <li>Additional services beyond the agreed package may incur extra fees</li>
              <li>All fees are subject to our Refund Policy</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, materials, and resources provided by Study Frontier, including but not limited to guides, templates, and proprietary methodologies, remain our intellectual property. Clients may not redistribute or commercialize these materials.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">7. Confidentiality</h2>
            <p className="text-muted-foreground">
              We maintain strict confidentiality of all client information. However, we may share necessary information with universities, testing agencies, and government authorities as required for your applications.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">8. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Study Frontier shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount of fees paid for the specific service in question.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">9. Termination</h2>
            <p className="text-muted-foreground">
              Either party may terminate the service agreement with written notice. Termination terms and any applicable refunds are governed by our Refund Policy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">10. Dispute Resolution</h2>
            <p className="text-muted-foreground">
              Any disputes arising from these terms shall be resolved through good faith negotiation. If negotiation fails, disputes shall be subject to the jurisdiction of courts in Washington DC, USA.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">11. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Continued use of our services constitutes acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">12. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms and Conditions, please contact us at:
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
