import type { Metadata } from "next";
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { SignOutButton } from '@/components/auth/sign-out-button';

export const metadata: Metadata = {
  title: "Parent View - Study Frontier",
  description: "Track your student's progress and key milestones.",
};

/**
 * Parent/Sponsor View Layout
 * Sprint 03: Added authentication and role protection
 * Sprint 08: Will add full navigation and student linking
 * 
 * Features to add in Sprint 08:
 * - Read-only navigation
 * - Student progress overview
 * - Key milestone indicators
 * - Limited visibility controls
 */
export default async function ParentLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const profile = await getUserProfile();

  // Redirect if not authenticated
  if (!profile) {
    redirect(`/${locale}/login?redirect=/${locale}/overview`);
  }

  // Redirect if not a parent
  if (profile.role !== 'parent') {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Parent Overview Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Parent/Sponsor View
              </h2>
              <p className="text-sm text-muted-foreground">
                Welcome, {profile.full_name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                Read-only Access
              </span>
              <SignOutButton className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                Sign Out
              </SignOutButton>
            </div>
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
