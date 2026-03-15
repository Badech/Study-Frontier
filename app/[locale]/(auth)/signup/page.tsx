/**
 * Student signup page
 * Allows students to create new accounts
 */

import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';

export const dynamic = 'force-dynamic';

export default async function SignupPage(props: {
  params: Promise<{ locale: string }>;
}) {
  // Await params (Next.js 15+ requirement)
  const { locale } = await props.params;
  
  // If already logged in, redirect to dashboard
  const user = await getCurrentUser();
  if (user) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Start Your Journey</h1>
        <p className="text-muted-foreground">
          Create your student account to begin your USA study application
        </p>
      </div>

      <AuthForm mode="signup" role="student" />

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link
            href={`/${locale}/login`}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
        <p className="text-muted-foreground mt-2">
          Are you a parent?{' '}
          <Link
            href={`/${locale}/signup/parent`}
            className="text-primary hover:underline font-medium"
          >
            Create parent account
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          By signing up, you agree to our{' '}
          <Link href={`/${locale}/terms`} className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href={`/${locale}/privacy`} className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link href={`/${locale}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
