/**
 * Student Appointments Page
 * Sprint 04: Student Portal - Appointments Management
 */

import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Calendar, Clock, Video, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const profile = await getUserProfile();

  if (!profile) {
    redirect(`/${locale}/login?redirect=/${locale}/dashboard/appointments`);
  }

  // Fetch appointments
  const supabase = await createClient();
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      *,
      counselor:profiles!appointments_counselor_id_fkey(full_name)
    `)
    .eq('student_id', profile.id)
    .order('scheduled_at', { ascending: false });

  const appts = appointments || [];

  // Separate upcoming and past
  const now = new Date();
  const upcoming = appts.filter(a => new Date(a.scheduled_at) >= now);
  const past = appts.filter(a => new Date(a.scheduled_at) < now);

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      'scheduled': 'default',
      'completed': 'success',
      'cancelled': 'error',
      'no_show': 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
      case 'no_show':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getAppointmentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'initial_consultation': 'Initial Consultation',
      'document_review': 'Document Review',
      'visa_coaching': 'Visa Coaching',
      'follow_up': 'Follow-up',
      'other': 'Other',
    };
    return labels[type] || type;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Appointments</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          View your scheduled appointments with counselors
        </p>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <h3 className="font-semibold text-sm mb-2">📅 Appointment Guidelines</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Appointments are scheduled by your counselor based on your stage and needs</li>
          <li>• You'll receive an email notification 24 hours before your appointment</li>
          <li>• Video call links will be provided in the appointment details</li>
          <li>• If you need to reschedule, contact us at least 24 hours in advance</li>
        </ul>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        {upcoming.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Upcoming Appointments</h3>
            <p className="text-sm text-muted-foreground">
              Your counselor will schedule appointments as needed during your journey.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((appt) => {
              const { date, time } = formatDateTime(appt.scheduled_at);
              const counselorName = Array.isArray(appt.counselor) 
                ? appt.counselor[0]?.full_name 
                : appt.counselor?.full_name;

              return (
                <div key={appt.id} className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{getAppointmentTypeLabel(appt.appointment_type)}</h3>
                        <StatusBadge status={appt.status} className="text-xs" />
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{time} ({appt.duration_minutes} minutes)</span>
                        </div>
                        {counselorName && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>with {counselorName}</span>
                          </div>
                        )}
                      </div>

                      {appt.notes && (
                        <div className="mt-3 p-3 rounded bg-muted text-sm">
                          <strong>Notes:</strong> {appt.notes}
                        </div>
                      )}
                    </div>

                    {appt.meeting_link && (
                      <div>
                        <Button asChild>
                          <a href={appt.meeting_link} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {past.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
          <div className="space-y-3">
            {past.map((appt) => {
              const { date, time } = formatDateTime(appt.scheduled_at);
              const counselorName = Array.isArray(appt.counselor) 
                ? appt.counselor[0]?.full_name 
                : appt.counselor?.full_name;

              return (
                <div key={appt.id} className="rounded-lg border border-border bg-card/50 p-4 opacity-75">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{getAppointmentTypeLabel(appt.appointment_type)}</h3>
                        <StatusBadge status={appt.status} className="text-xs" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {date} at {time}
                        {counselorName && <> • with {counselorName}</>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Need to Schedule? */}
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <h3 className="font-medium mb-2">Need to Schedule an Appointment?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Contact your counselor if you need to schedule a consultation or have any questions.
        </p>
        <Button variant="outline" asChild>
          <a href="/dashboard/messages">
            Send Message
          </a>
        </Button>
      </div>
    </div>
  );
}
