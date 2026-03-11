import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parent View - Study Frontier",
  description: "Track your student's progress and key milestones.",
};

/**
 * Parent/Sponsor View Layout
 * Sprint 00: Basic structure - will be enhanced in Sprint 08
 * 
 * Features to add:
 * - Read-only navigation
 * - Student progress overview
 * - Key milestone indicators
 * - Limited visibility controls
 */
export default function ParentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Placeholder for parent view navigation */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-card-foreground">
            Parent/Sponsor View
          </h2>
          <p className="text-sm text-muted-foreground">
            Sprint 00 - Layout structure ready for Sprint 08 implementation
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
