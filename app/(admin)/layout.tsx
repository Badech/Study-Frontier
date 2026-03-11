import type { Metadata } from "next";
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { SignOutButton } from '@/components/auth/sign-out-button';

export const metadata: Metadata = {
  title: "Admin Dashboard - Study Frontier",
  description: "Manage leads, students, documents, and operations.",
};

/**
 * Admin Dashboard Layout
 * Sprint 03: Added authentication and role protection
 * Sprint 05: Will add full navigation sidebar
 * 
 * Features to add in Sprint 05:
 * - Admin sidebar navigation
 * - Quick stats header
 * - Notifications
 * - User menu
 */
export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getUserProfile();

  // Redirect if not authenticated
  if (!profile) {
    redirect('/login?redirect=/admin');
  }

  // Redirect if not admin or counselor
  if (profile.role !== 'admin' && profile.role !== 'counselor') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Dashboard Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Admin Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile.full_name} ({profile.role})
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
