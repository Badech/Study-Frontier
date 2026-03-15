/**
 * Login page
 * Handles user authentication for all roles
 */

import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';

export const dynamic = 'force-dynamic';

export default async function LoginPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string }>;
}) {
  // Await params and searchParams (Next.js 15+ requirement)
  const { locale } = await props.params;
  const searchParams = await props.searchParams;
  
  // If already logged in, redirect to appropriate dashboard
  const user = await getCurrentUser();
  if (user) {
    redirect(searchParams.redirect || `/${locale}/dashboard`);
  }

  return (
    <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to your Study Frontier account</p>
      </div>

      <AuthForm mode="signin" redirectTo={searchParams.redirect} />

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href={`/${locale}/signup`}
            className="text-primary hover:underline font-medium"
          >
            Sign up as a student
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

      <div className="mt-8 pt-6 border-t border-border text-center">
        <Link href={`/${locale}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
