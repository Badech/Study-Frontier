import type { Metadata } from "next";
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { SignOutButton } from '@/components/auth/sign-out-button';

export const metadata: Metadata = {
  title: "Student Portal - Study Frontier",
  description: "Manage your documents, track progress, and navigate your journey to studying in the USA.",
};

/**
 * Student Portal Layout
 * Sprint 03: Added authentication and role protection
 * Sprint 04: Will add full navigation sidebar
 * 
 * Features to add in Sprint 04:
 * - Student navigation sidebar
 * - Progress indicator
 * - Notification bell
 * - Profile dropdown
 */
export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getUserProfile();

  // Redirect if not authenticated
  if (!profile) {
    redirect('/login?redirect=/dashboard');
  }

  // Redirect if not a student
  if (profile.role !== 'student') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Student Portal Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Student Portal
              </h2>
              <p className="text-sm text-muted-foreground">
                Welcome, {profile.full_name}
              </p>
            </div>
            <SignOutButton className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              Sign Out
            </SignOutButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
