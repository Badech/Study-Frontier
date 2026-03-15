/**
 * Admin Leads Page
 * Sprint 05: Admin Dashboard - Lead Management
 */

import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { LeadsTable } from '@/components/admin/leads-table';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const profile = await getUserProfile();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'counselor')) {
    redirect('/login');
  }

  // Fetch leads from database
  const supabase = await createClient();
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
  }

  const leadsData = leads || [];

  // Calculate stats
  const stats = {
    total: leadsData.length,
    new: leadsData.filter(l => l.status === 'new').length,
    contacted: leadsData.filter(l => l.status === 'contacted').length,
    qualified: leadsData.filter(l => l.status === 'qualified').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage incoming inquiries and convert leads to students
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Leads</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.new}</div>
          <div className="text-sm text-muted-foreground">New (Uncontacted)</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.contacted}</div>
          <div className="text-sm text-muted-foreground">Contacted</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-green-600">{stats.qualified}</div>
          <div className="text-sm text-muted-foreground">Qualified</div>
        </div>
      </div>

      {/* Leads Table */}
      <LeadsTable leads={leadsData} />
    </div>
  );
}
