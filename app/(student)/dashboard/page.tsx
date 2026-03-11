/**
 * Student Dashboard Page
 * Sprint 00: Placeholder - will be implemented in Sprint 04
 */
export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to your student portal
        </p>
      </div>

      {/* Placeholder Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">Next Action</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 04
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">Progress</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 04
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">Documents</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 06
          </p>
        </div>
      </div>
    </div>
  );
}
