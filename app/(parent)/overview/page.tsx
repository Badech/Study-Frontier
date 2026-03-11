/**
 * Parent Overview Page
 * Sprint 00: Placeholder - will be implemented in Sprint 08
 */
export default function ParentOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student Overview</h1>
        <p className="text-sm text-muted-foreground">
          Monitor your student&apos;s progress (read-only access)
        </p>
      </div>

      {/* Placeholder Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">Current Stage</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 08
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">Next Milestone</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 08
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">Recent Updates</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 08
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-card-foreground">Important Dates</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Coming in Sprint 08
          </p>
        </div>
      </div>

      {/* Read-only Notice */}
      <div className="rounded-lg border border-info/20 bg-info/10 p-4">
        <p className="text-sm text-info-foreground">
          <strong>Note:</strong> This is a read-only view. You can monitor progress but cannot make changes to the student&apos;s case.
        </p>
      </div>
    </div>
  );
}