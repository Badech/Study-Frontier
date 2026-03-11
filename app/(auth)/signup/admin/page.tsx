/**
 * Admin signup page (invite-only)
 * This page should only be accessible via invite link
 * In production, this would be protected by an invite token
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';

export default async function AdminSignupPage(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  // Await searchParams (Next.js 15+ requirement)
  const searchParams = await props.searchParams;
  
  // If already logged in, redirect to admin dashboard
  const user = await getCurrentUser();
  if (user) {
    redirect('/admin');
  }

  // In production, validate invite token here
  // For now, we'll show a placeholder message
  const hasValidToken = searchParams.token; // Simplified for MVP

  if (!hasValidToken) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">
            Invitation Required
          </h1>
          <p className="text-gray-600 mb-6">
            Admin accounts can only be created by invitation. Please contact your
            system administrator for an invite link.
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Account Setup</h1>
        <p className="text-gray-600">
          Create your admin account to manage the Study Frontier platform
        </p>
      </div>

      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>Admin Access:</strong> You&apos;ll have full access to student
          management, leads, documents, payments, and all platform features.
        </p>
      </div>

      {/* In production, use AuthForm with role="admin" */}
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-yellow-800 mb-4">
          <strong>MVP Notice:</strong> Admin accounts must be created manually via
          Supabase dashboard during MVP phase.
        </p>
        <p className="text-sm text-yellow-700">
          Full admin signup flow will be implemented in a future sprint with proper
          invite token validation.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
