import { getTranslations } from 'next-intl/server';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground">
              Study Frontier ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services and website.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
            <p className="text-muted-foreground">We collect information that you provide directly to us, including:</p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Academic records and educational background</li>
              <li>Passport and visa-related documents</li>
              <li>Financial information for payment processing</li>
              <li>Communication preferences and correspondence</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use the information we collect to:</p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Provide, maintain, and improve our consulting services</li>
              <li>Process university applications and visa documentation</li>
              <li>Communicate with you about your application progress</li>
              <li>Send you updates, newsletters, and marketing communications (with your consent)</li>
              <li>Comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">4. Information Sharing and Disclosure</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Universities and educational institutions you apply to</li>
              <li>Service providers who assist us in operating our business</li>
              <li>Government authorities when required by law</li>
              <li>Professional advisors and consultants working on your behalf</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw consent for data processing</li>
              <li>Object to processing of your personal data</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">8. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than Morocco, including the United States. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">9. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at:
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
