import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Study Frontier",
  description: "Manage leads, students, documents, and operations.",
};

/**
 * Admin Dashboard Layout
 * Sprint 00: Basic structure - will be enhanced in Sprint 05
 * 
 * Features to add:
 * - Admin sidebar navigation
 * - Quick stats header
 * - Notifications
 * - User menu
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Placeholder for admin dashboard navigation */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-card-foreground">
            Admin Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Sprint 00 - Layout structure ready for Sprint 05 implementation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
