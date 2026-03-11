/**
 * Auth pages layout
 * Simple centered layout for login and signup pages
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Study Frontier',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
