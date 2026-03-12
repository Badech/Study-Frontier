/**
 * Admin Leads Management Page
 * Sprint 05: Admin Dashboard
 * 
 * View and manage lead submissions
 */

import { getLeads } from '@/lib/data/admin';
import { LeadsTable } from '@/components/admin/leads-table';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const { leads, total } = await getLeads({ limit: 100 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Manage eligibility assessment submissions
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {total} leads
        </div>
      </div>

      {/* Filter Options - Future Enhancement */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Filters: Coming soon (status, qualification label, search)
          </div>
        </div>
      </Card>

      {/* Leads Table */}
      <LeadsTable leads={leads} />
    </div>
  );
}
