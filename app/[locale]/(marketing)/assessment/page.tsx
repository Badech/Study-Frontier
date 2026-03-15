/**
 * Detailed Eligibility Assessment Page
 * Phase 1, Task 1.1 - PRD Section 12: Main website conversion flow
 * 2-step form with 18+ fields for high-quality lead filtering
 */

import { AssessmentFormDetailed } from '@/components/marketing/assessment-form-detailed';

export const metadata = {
  title: 'Free Eligibility Assessment | Study Frontier',
  description: 'Complete our detailed assessment to determine your eligibility for studying in the USA.',
};

export default async function AssessmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Free Eligibility Assessment
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete this detailed assessment to help us understand your profile and recommend the best pathway for your studies in the USA.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure & Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Takes 5-7 minutes</span>
            </div>
          </div>
        </div>

        {/* Assessment Form */}
        <div className="bg-card rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 border border-border">
          <AssessmentFormDetailed />
        </div>

        {/* Trust Signal */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Your information is secure and will only be used to provide you with personalized guidance.
            <br />
            We respect your privacy and never share your data with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
