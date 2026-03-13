/**
 * Appointments Card Component
 * Sprint 04: Shows upcoming appointments and sessions
 */

import { Calendar, Clock, Video, MapPin } from 'lucide-react';
import { DashboardCard } from './dashboard-card';
import type { Appointment } from '@/types';
import { format } from 'date-fns';

interface AppointmentsCardProps {
  appointments: Appointment[];
}

export function AppointmentsCard({ appointments }: AppointmentsCardProps) {
  const hasAppointments = appointments.length > 0;

  const getAppointmentIcon = (type: string | null) => {
    switch (type) {
      case 'video_call':
        return <Video className="h-4 w-4" />;
      case 'in_person':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string | null) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    const label = status === 'confirmed' ? 'Confirmed' : status === 'scheduled' ? 'Scheduled' : status || 'Pending';

    return (
      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colors[status as keyof typeof colors] || colors.scheduled}`}>
        {label}
      </span>
    );
  };

  return (
    <DashboardCard
      title="Upcoming Appointments"
      subtitle={hasAppointments ? `${appointments.length} upcoming` : 'No appointments scheduled'}
      icon={<Calendar className="h-5 w-5" />}
      action={
        <a
          href="/dashboard/appointments"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {hasAppointments ? 'View All' : 'Book'}
        </a>
      }
    >
      {!hasAppointments ? (
        <div className="text-center py-6">
          <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-4">
            No appointments scheduled yet
          </p>
          <button 
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="Book a new appointment"
          >
            Book Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              {/* Appointment Icon */}
              <div className="flex-shrink-0 mt-1">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {getAppointmentIcon(appointment.type)}
                </div>
              </div>

              {/* Appointment Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h5 className="font-medium text-sm text-card-foreground">
                    {appointment.title || 'Appointment'}
                  </h5>
                  {getStatusBadge(appointment.status)}
                </div>

                {appointment.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    {appointment.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {appointment.scheduled_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{format(new Date(appointment.scheduled_at), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  {appointment.scheduled_at && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{format(new Date(appointment.scheduled_at), 'h:mm a')}</span>
                    </div>
                  )}
                  {appointment.duration_minutes && (
                    <div className="flex items-center gap-1">
                      <span>•</span>
                      <span>{appointment.duration_minutes} min</span>
                    </div>
                  )}
                </div>

                {appointment.meeting_url && appointment.status === 'confirmed' && (
                  <div className="mt-2">
                    <a
                      href={appointment.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Join Meeting
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
