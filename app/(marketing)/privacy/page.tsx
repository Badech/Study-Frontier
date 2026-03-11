export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-muted-foreground">Last updated: March 11, 2026</p>

        <div className="prose prose-slate max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground">
              Study Frontier ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our services 
              and website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
            <h3 className="mb-2 text-xl font-semibold">Personal Information</h3>
            <p className="mb-4 text-muted-foreground">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Name, email address, phone number, and contact details</li>
              <li>Academic records, transcripts, and test scores</li>
              <li>Financial information for service payments</li>
              <li>Passport and visa-related documents</li>
              <li>Personal statements and application materials</li>
            </ul>

            <h3 className="mb-2 text-xl font-semibold">Usage Information</h3>
            <p className="text-muted-foreground">
              We automatically collect certain information about your device and how you interact with our website, 
              including IP address, browser type, pages visited, and time spent on pages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
            <p className="mb-4 text-muted-foreground">We use your information to:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Provide educational consulting services</li>
              <li>Process university applications and visa documentation</li>
              <li>Communicate with you about your application progress</li>
              <li>Improve our services and website functionality</li>
              <li>Comply with legal obligations</li>
              <li>Send you relevant updates and information (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">4. Information Sharing</h2>
            <p className="mb-4 text-muted-foreground">
              We may share your information with:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Universities:</strong> We share application materials with universities you choose to apply to</li>
              <li><strong>Service Providers:</strong> Third-party vendors who assist in providing our services (e.g., payment processors)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
              <li><strong>Parents/Sponsors:</strong> With your consent, we provide read-only access to your progress</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
              over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Your Rights</h2>
            <p className="mb-4 text-muted-foreground">You have the right to:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information (subject to legal obligations)</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your information for as long as necessary to provide our services and comply with legal 
              obligations. Application materials are typically retained for 7 years after service completion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are intended for students typically aged 16 and older. For students under 18, we require 
              parental consent before collecting personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@studyfrontier.com
              <br />
              Address: Casablanca, Morocco
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
