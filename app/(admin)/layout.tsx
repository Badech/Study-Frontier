import type { Metadata } from "next";
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { AdminNav } from '@/components/admin/admin-nav';

export const metadata: Metadata = {
  title: "Admin Dashboard - Study Frontier",
  description: "Manage leads, students, documents, and operations.",
};

/**
 * Admin Dashboard Layout
 * Sprint 03: Added authentication and role protection
 * Sprint 05: Full navigation sidebar, enhanced header
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
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Study Frontier Admin
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

      {/* Sidebar + Main Content Layout */}
      <div className="flex">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden lg:block w-64 bg-card border-r border-border min-h-[calc(100vh-73px)]">
          <div className="p-6">
            <AdminNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation - Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
        <AdminNav />
      </div>
    </div>
  );
}
