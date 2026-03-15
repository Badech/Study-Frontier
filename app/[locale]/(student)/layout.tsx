import type { Metadata } from "next";
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { SignOutButton } from '@/components/auth/sign-out-button';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  GraduationCap, 
  Calendar, 
  MessageSquare,
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Student Portal - Study Frontier",
  description: "Manage your documents, track progress, and navigate your journey to studying in the USA.",
};

/**
 * Student Portal Layout
 * Sprint 03: Added authentication and role protection
 * Sprint 04: Enhanced with mobile-first navigation
 * 
 * Features:
 * - Mobile-first responsive navigation
 * - Quick action links
 * - User profile display
 * - Clean, accessible layout
 */
export default async function StudentLayout({
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
    redirect(`/${locale}/login?redirect=/${locale}/dashboard`);
  }

  // Redirect if not a student - send to appropriate dashboard
  if (profile.role !== 'student') {
    if (profile.role === 'admin') {
      redirect(`/${locale}/admin`);
    } else if (profile.role === 'parent') {
      redirect(`/${locale}/overview`);
    } else {
      // Fallback to login if unknown role
      redirect(`/${locale}/login`);
    }
  }

  const navItems = [
    { href: `/${locale}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${locale}/dashboard/documents`, label: 'Documents', icon: FileText },
    { href: `/${locale}/dashboard/applications`, label: 'Applications', icon: GraduationCap },
    { href: `/${locale}/dashboard/appointments`, label: 'Appointments', icon: Calendar },
    { href: `/${locale}/dashboard/messages`, label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">SF</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-base font-semibold text-card-foreground">
                    Study Frontier
                  </h1>
                  <p className="text-xs text-muted-foreground">Student Portal</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              {/* User Info - Hidden on mobile */}
              <div className="hidden md:block text-right mr-2">
                <p className="text-sm font-medium text-card-foreground">
                  {profile.full_name || 'Student'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile.email}
                </p>
              </div>

              {/* Sign Out Button */}
              <SignOutButton className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
                Sign Out
              </SignOutButton>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden border-t border-border">
            <nav className="flex overflow-x-auto py-2 gap-1 scrollbar-hide">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-3 py-2 min-w-[70px] text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Study Frontier. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/${locale}/support`} className="text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
              <Link href={`/${locale}/privacy`} className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href={`/${locale}/terms`} className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
