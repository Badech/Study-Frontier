import { getTranslations } from 'next-intl/server';
import { CheckCircle2 } from 'lucide-react';

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Our Services</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Comprehensive support packages designed for every stage of your journey to studying in the USA.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="mb-4 text-2xl font-semibold">University Selection</h3>
          <ul className="mb-6 space-y-3">
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">Personalized university matching</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">Application strategy planning</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">Essay and SOP review</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-primary bg-card p-8">
          <div className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </div>
          <h3 className="mb-4 text-2xl font-semibold">Complete Journey</h3>
          <ul className="mb-6 space-y-3">
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">End-to-end application support</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">Visa preparation and interview prep</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">Pre-departure orientation</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="mb-4 text-2xl font-semibold">Visa Support</h3>
          <ul className="mb-6 space-y-3">
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">DS-160 form assistance</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">Interview preparation</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">Document verification</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
