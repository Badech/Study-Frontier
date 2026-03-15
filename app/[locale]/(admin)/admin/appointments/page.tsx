/**
 * Admin Appointments Management Page
 * Sprint 05: Admin Dashboard
 * 
 * View and manage all appointments
 */

import { getAdminAppointments } from '@/lib/data/admin';
import { AppointmentsList } from '@/components/admin/appointments-list';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminAppointmentsPage() {
  // Get upcoming appointments
  const { appointments, total } = await getAdminAppointments({
    dateFrom: new Date().toISOString(),
    limit: 100,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all appointments
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total upcoming: {total}
        </div>
      </div>

      {/* Filter Options - Future Enhancement */}
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">
          Filters: Coming soon (type, status, date range, calendar view)
        </div>
      </Card>

      {/* Appointments List */}
      <AppointmentsList appointments={appointments} />
    </div>
  );
}
