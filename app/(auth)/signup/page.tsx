/**
 * Student signup page
 * Allows students to create new accounts
 */

import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';

export default async function SignupPage() {
  // If already logged in, redirect to dashboard
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Start Your Journey</h1>
        <p className="text-gray-600">
          Create your student account to begin your USA study application
        </p>
      </div>

      <AuthForm mode="signup" role="student" />

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in
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

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
