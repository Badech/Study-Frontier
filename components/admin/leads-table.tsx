/**
 * Admin Leads Table Component
 * Sprint 05: Admin Dashboard
 * Displays and manages lead submissions
 */

import { Card } from '@/components/ui/card';
import { Lead } from '@/types';

interface LeadsTableProps {
  leads: Lead[];
}

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  disqualified: 'bg-red-100 text-red-700',
  converted: 'bg-purple-100 text-purple-700',
};

const labelColors = {
  high_potential: 'bg-emerald-100 text-emerald-700',
  needs_followup: 'bg-orange-100 text-orange-700',
  budget_mismatch: 'bg-red-100 text-red-700',
  not_qualified_yet: 'bg-slate-100 text-slate-700',
  visa_risk_profile: 'bg-yellow-100 text-yellow-700',
};

export function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No leads found</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Leads list">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Study Goal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Label
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Submitted
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{lead.full_name}</div>
                  <div className="text-xs text-muted-foreground">{lead.city || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{lead.email}</div>
                  <div className="text-xs text-muted-foreground">{lead.whatsapp || 'No WhatsApp'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{lead.desired_study_level || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">{lead.intended_major || 'Undecided'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[lead.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.qualification_label ? (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      labelColors[lead.qualification_label as keyof typeof labelColors] || 'bg-gray-100 text-gray-700'
                    }`}>
                      {lead.qualification_label.replace(/_/g, ' ')}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No label</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
