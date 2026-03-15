/**
 * Assessment Success Page
 * Shown after successful assessment submission
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, MessageCircle, ArrowRight } from 'lucide-react';

export default async function AssessmentSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Assessment Received!</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Thank you for completing your eligibility assessment. Our team will review your profile 
          and get back to you within 24-48 hours with personalized recommendations.
        </p>

        {/* What Happens Next */}
        <div className="mb-12 rounded-2xl border border-border bg-card p-8 text-left">
          <h2 className="mb-4 text-xl font-semibold">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                1
              </div>
              <div>
                <h3 className="font-medium">Profile Review</h3>
                <p className="text-sm text-muted-foreground">
                  Our counselors will carefully review your academic background, goals, and budget.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                2
              </div>
              <div>
                <h3 className="font-medium">Personalized Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  We'll prepare customized pathway suggestions and package recommendations.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                3
              </div>
              <div>
                <h3 className="font-medium">Initial Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule a free consultation call to discuss your options and next steps.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            Want to speak with us sooner?
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`}>
                <Calendar className="mr-2 h-4 w-4" />
                Book a Consultation
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://wa.me/17168904684" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link 
            href={`/${locale}`}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
