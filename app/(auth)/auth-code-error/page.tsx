/**
 * Auth error page
 * Displayed when auth callback fails
 */

import Link from 'next/link';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-6">
            There was a problem confirming your email. The link may have expired or
            already been used.
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Logging In
            </Link>
            <Link
              href="/signup"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
