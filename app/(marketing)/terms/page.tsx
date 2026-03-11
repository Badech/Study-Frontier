export default function TermsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        <p className="mb-8 text-muted-foreground">Last updated: March 11, 2026</p>

        <div className="prose prose-slate max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Study Frontier's services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">2. Services Description</h2>
            <p className="mb-4 text-muted-foreground">
              Study Frontier provides educational consulting services to help students apply to universities in 
              the United States. Our services include:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Academic profile assessment and university selection guidance</li>
              <li>Application support and document review</li>
              <li>Visa preparation and interview coaching</li>
              <li>Pre-departure orientation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">3. No Guarantees</h2>
            <p className="mb-4 text-muted-foreground">
              <strong>Important:</strong> Study Frontier does not and cannot guarantee:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Admission to any specific university or program</li>
              <li>Visa approval from the US Embassy</li>
              <li>Scholarship or financial aid awards</li>
              <li>Specific outcomes or results</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              We provide expert guidance to maximize your chances of success, but final decisions rest with 
              universities and government authorities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">4. Client Responsibilities</h2>
            <p className="mb-4 text-muted-foreground">As a client, you agree to:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Provide accurate and truthful information</li>
              <li>Submit required documents in a timely manner</li>
              <li>Attend scheduled counseling sessions</li>
              <li>Follow our guidance and recommendations</li>
              <li>Make timely payments according to the agreed schedule</li>
              <li>Respect deadlines and timelines</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Payment Terms</h2>
            <p className="mb-4 text-muted-foreground">
              Service fees are outlined in your service agreement. Payment terms include:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Fees must be paid according to the agreed schedule</li>
              <li>Late payments may result in service suspension</li>
              <li>Refunds are subject to our Refund Policy</li>
              <li>University application fees and other third-party costs are separate and non-refundable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content provided through our services, including guides, templates, and resources, remains the 
              intellectual property of Study Frontier. You may not reproduce, distribute, or sell our materials 
              without written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">7. Confidentiality</h2>
            <p className="text-muted-foreground">
              We maintain strict confidentiality of your personal information and application materials, except 
              where disclosure is necessary to provide services (e.g., submitting applications to universities) 
              or required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">8. Service Termination</h2>
            <p className="mb-4 text-muted-foreground">
              Either party may terminate the service agreement:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>By Client:</strong> With written notice, subject to refund policy</li>
              <li><strong>By Study Frontier:</strong> For breach of terms, non-payment, or providing false information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">9. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Study Frontier shall not be liable for any indirect, incidental, or consequential damages arising 
              from the use of our services. Our total liability shall not exceed the amount paid for services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">10. Dispute Resolution</h2>
            <p className="text-muted-foreground">
              Any disputes arising from these terms shall be resolved through good-faith negotiation. If 
              negotiation fails, disputes shall be subject to the laws of Morocco.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">11. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of our services after changes 
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">12. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, contact us at:
              <br />
              Email: legal@studyfrontier.com
              <br />
              Address: Casablanca, Morocco
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
