/**
 * Auth Code Error Page
 * Shown when email confirmation link is invalid or expired
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default async function AuthCodeErrorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="mb-4 text-3xl font-bold">Verification Link Invalid</h1>
        <p className="mb-8 text-muted-foreground">
          The verification link you clicked is either invalid or has expired. 
          Email verification links are only valid for 24 hours.
        </p>

        {/* What to Do */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6 text-left">
          <h2 className="mb-3 font-semibold">What to do next:</h2>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Go to the login page</li>
            <li>Enter your email address</li>
            <li>Request a new verification email</li>
            <li>Check your inbox for a fresh link</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href={`/${locale}/login`}>
              Go to Login
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={`/${locale}`}>
              Back to Homepage
            </Link>
          </Button>
        </div>

        {/* Help */}
        <p className="mt-8 text-sm text-muted-foreground">
          Still having trouble?{' '}
          <Link href={`/${locale}/contact`} className="text-primary hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
