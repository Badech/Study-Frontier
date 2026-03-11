/**
 * Admin Dashboard Home Page
 * Sprint 00: Placeholder - will be implemented in Sprint 05
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Operations and student management
        </p>
      </div>

      {/* Placeholder Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">New Leads</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 05
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">Active Students</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 05
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">Pending Reviews</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 05
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">Tasks</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 05
          </p>
        </div>
      </div>
    </div>
  );
}
