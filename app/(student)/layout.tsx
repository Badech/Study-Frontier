import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Portal - Study Frontier",
  description: "Manage your documents, track progress, and navigate your journey to studying in the USA.",
};

/**
 * Student Portal Layout
 * Sprint 00: Basic structure - will be enhanced in Sprint 04
 * 
 * Features to add:
 * - Student navigation sidebar
 * - Progress indicator
 * - Notification bell
 * - Profile dropdown
 */
export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Placeholder for student portal navigation */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-card-foreground">
            Student Portal
          </h2>
          <p className="text-sm text-muted-foreground">
            Sprint 00 - Layout structure ready for Sprint 04 implementation
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
