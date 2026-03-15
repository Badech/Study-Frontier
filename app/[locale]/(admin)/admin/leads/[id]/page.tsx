/**
 * Lead Detail Page
 * Admin view of individual lead's complete assessment submission
 */

import { redirect, notFound } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { LeadActions } from '@/components/admin/lead-actions';
import { ArrowLeft, MapPin, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function LeadDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const profile = await getUserProfile();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'counselor')) {
    redirect(`/${locale}/login`);
  }

  // Fetch lead data
  const supabase = await createClient();
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !lead) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      'new': 'warning',
      'contacted': 'default',
      'qualified': 'success',
      'not_qualified': 'error',
      'converted': 'success',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/admin/leads`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Link>
        </Button>
      </div>

      {/* Lead Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">{lead.full_name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {lead.email}
              </div>
              {lead.whatsapp && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {lead.whatsapp}
                </div>
              )}
              {lead.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {lead.city}, {lead.nationality}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="mt-1">
                <StatusBadge status={getStatusColor(lead.status)}>
                  {lead.status}
                </StatusBadge>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Date */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Submitted {new Date(lead.created_at).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Assessment Answers Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Full Name</div>
              <div className="font-medium">{lead.full_name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{lead.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">WhatsApp Number</div>
              <div className="font-medium">{lead.whatsapp || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">City</div>
              <div className="font-medium">{lead.city || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Nationality</div>
              <div className="font-medium">{lead.nationality || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Age</div>
              <div className="font-medium">{lead.age || 'Not provided'}</div>
            </div>
          </div>
        </div>

        {/* Study Preferences */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Study Preferences</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Preferred Destination</div>
              <div className="font-medium">{lead.preferred_destination || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Desired Intake</div>
              <div className="font-medium">{lead.desired_intake || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Desired Study Level</div>
              <div className="font-medium">{lead.desired_study_level || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Intended Major</div>
              <div className="font-medium">{lead.intended_major || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Academic Background */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Academic Background</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Highest Education</div>
              <div className="font-medium">{lead.highest_education || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Current Institution</div>
              <div className="font-medium">{lead.current_institution || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">GPA / Average</div>
              <div className="font-medium">{lead.gpa_average || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">English Level</div>
              <div className="font-medium">{lead.english_level || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Test Status (TOEFL/IELTS)</div>
              <div className="font-medium">{lead.test_status || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Financial Information</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Budget Range</div>
              <div className="font-medium">{lead.budget_range || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sponsor Type</div>
              <div className="font-medium">{lead.sponsor_type || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Prior U.S. Visa Refusal</div>
              <div className="font-medium flex items-center gap-2">
                {lead.prior_visa_refusal ? (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">Yes</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">No</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Statement */}
      {lead.goal_statement && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Goal Statement</h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {lead.goal_statement}
          </p>
        </div>
      )}

      {/* Admin Notes */}
      {lead.admin_notes && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Admin Notes</h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {lead.admin_notes}
          </p>
        </div>
      )}

      {/* Tracking Information */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Tracking Information</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-sm text-muted-foreground">Lead Status</div>
            <div className="font-medium">{lead.status}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Qualification Label</div>
            <div className="font-medium">{lead.qualification_label || 'Not set'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Source</div>
            <div className="font-medium">{lead.source || 'Unknown'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Created</div>
            <div className="font-medium">{new Date(lead.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <LeadActions 
          leadId={lead.id}
          leadEmail={lead.email}
          leadName={lead.full_name}
          leadWhatsapp={lead.whatsapp}
          currentStatus={lead.status}
        />
      </div>
    </div>
  );
}
