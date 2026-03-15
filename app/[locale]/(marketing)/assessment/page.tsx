/**
 * Eligibility Assessment Page
 * PRD Section 12: Main website conversion flow
 */

import { AssessmentFormSimple } from '@/components/marketing/assessment-form-simple';
import { Suspense } from 'react';

export default async function AssessmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Free Eligibility Assessment</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Take our detailed assessment to discover your pathway to studying in the USA. 
          We'll review your profile and recommend the best-fit package for your goals.
        </p>
      </div>

      <Suspense fallback={
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Loading assessment form...</p>
        </div>
      }>
        <AssessmentFormSimple locale={locale} />
      </Suspense>
    </div>
  );
}
