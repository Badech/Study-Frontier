/**
 * Admin Appointments List Component
 * Sprint 05: Admin Dashboard
 * Displays upcoming appointments
 */

import { Card } from '@/components/ui/card';
import { Calendar, Clock, User } from 'lucide-react';

interface Appointment {
  id: string;
  title: string;
  type: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  student_name?: string;
  student_email?: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
}

const typeColors = {
  initial_consultation: 'bg-blue-100 text-blue-700',
  document_review: 'bg-yellow-100 text-yellow-700',
  visa_coaching: 'bg-purple-100 text-purple-700',
  mock_interview: 'bg-orange-100 text-orange-700',
  general: 'bg-slate-100 text-slate-700',
};

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-orange-100 text-orange-700',
};

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No upcoming appointments</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => {
        const scheduledDate = new Date(appointment.scheduled_at);
        
        return (
          <Card key={appointment.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    typeColors[appointment.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-700'
                  }`}>
                    {appointment.type.replace(/_/g, ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[appointment.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground">{appointment.title}</h4>
                {appointment.student_name && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{appointment.student_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{scheduledDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span>{appointment.duration_minutes} min</span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
