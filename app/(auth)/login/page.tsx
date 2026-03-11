/**
 * Login page
 * Handles user authentication for all roles
 */

import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  // If already logged in, redirect to appropriate dashboard
  const user = await getCurrentUser();
  if (user) {
    redirect(searchParams.redirect || '/dashboard');
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your Study Frontier account</p>
      </div>

      <AuthForm mode="signin" redirectTo={searchParams.redirect} />

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up as a student
          </Link>
        </p>
        <p className="text-gray-600 mt-2">
          Are you a parent?{' '}
          <Link
            href="/signup/parent"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create parent account
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
