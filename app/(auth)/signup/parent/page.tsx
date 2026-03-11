/**
 * Parent signup page
 * Allows parents/sponsors to create accounts for monitoring student progress
 */

import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';

export default async function ParentSignupPage() {
  // If already logged in, redirect to overview
  const user = await getCurrentUser();
  if (user) {
    redirect('/overview');
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Parent/Sponsor Account</h1>
        <p className="text-gray-600">
          Create a parent account to monitor your student&apos;s progress
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">What you can do:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ View your student&apos;s application progress</li>
          <li>✓ Track document submissions and approvals</li>
          <li>✓ Monitor payment status and deadlines</li>
          <li>✓ View upcoming appointments and milestones</li>
        </ul>
      </div>

      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Parent accounts have read-only access. You will
          need to be linked to a student account by an administrator after signup.
        </p>
      </div>

      <AuthForm mode="signup" role="parent" />

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
          Are you a student?{' '}
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create student account
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
