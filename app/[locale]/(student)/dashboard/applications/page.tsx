/**
 * Student Applications Page
 * Sprint 06: View and track university applications
 */

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';
import { getStudentApplications } from '@/lib/data/student';
import { StatusBadge } from '@/components/ui/status-badge';
import { GraduationCap, Calendar, ExternalLink, MapPin, Clock } from 'lucide-react';
import type { ApplicationWithRecommendation } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Applications - Study Frontier',
  description: 'Track your university applications',
};

function ApplicationCard({ application }: { application: ApplicationWithRecommendation }) {
  const hasDeadline = application.submission_deadline;
  const isSubmitted = ['submitted', 'waiting_for_decision', 'accepted', 'rejected'].includes(application.status);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <GraduationCap className="mt-1 h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{application.school_name}</h3>
              <p className="text-sm text-gray-600">{application.program_name}</p>
              <p className="mt-1 text-xs text-gray-500">{application.degree_level}</p>
            </div>
          </div>
        </div>
        <StatusBadge status={application.status} variant="application" />
      </div>

      {/* Details */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        {application.intake && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Intake: {application.intake}</span>
          </div>
        )}

        {hasDeadline && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              Deadline: {new Date(application.submission_deadline!).toLocaleDateString()}
            </span>
          </div>
        )}

        {application.submitted_at && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              Submitted: {new Date(application.submitted_at).toLocaleDateString()}
            </span>
          </div>
        )}

        {application.decision_date && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              Decision: {new Date(application.decision_date).toLocaleDateString()}
            </span>
          </div>
        )}

        {application.application_url && (
          <a
            href={application.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Application Portal</span>
          </a>
        )}
      </div>

      {/* Next Action */}
      {application.next_action && (
        <div className="mt-4 rounded-md bg-blue-50 p-3">
          <p className="text-sm font-medium text-blue-800">Next Action:</p>
          <p className="mt-1 text-sm text-blue-700">{application.next_action}</p>
        </div>
      )}

      {/* Notes */}
      {application.notes && (
        <div className="mt-4 rounded-md bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">Notes:</p>
          <p className="mt-1 text-sm text-gray-600">{application.notes}</p>
        </div>
      )}

      {/* Decision Status */}
      {application.decision_status && (
        <div className={`mt-4 rounded-md p-3 ${
          application.status === 'accepted' 
            ? 'bg-green-50' 
            : application.status === 'rejected' 
            ? 'bg-red-50' 
            : 'bg-gray-50'
        }`}>
          <p className={`text-sm font-medium ${
            application.status === 'accepted' 
              ? 'text-green-800' 
              : application.status === 'rejected' 
              ? 'text-red-800' 
              : 'text-gray-700'
          }`}>
            Decision: {application.decision_status}
          </p>
        </div>
      )}
    </div>
  );
}

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login?redirect=/${locale}/dashboard/applications`);
  }

  const applications = await getStudentApplications(user.id);

  // Group applications by status
  const inProgress = applications.filter(app => 
    ['not_started', 'in_preparation', 'ready_to_submit'].includes(app.status)
  );
  const submitted = applications.filter(app => 
    ['submitted', 'waiting_for_decision'].includes(app.status)
  );
  const decided = applications.filter(app => 
    ['accepted', 'rejected', 'closed'].includes(app.status)
  );

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Applications</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Track the status of your university applications and upcoming deadlines.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Total Applications</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{applications.length}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">{inProgress.length}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Submitted</p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">{submitted.length}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Accepted</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {applications.filter(a => a.status === 'accepted').length}
            </p>
          </div>
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
            <p className="mt-2 text-gray-600">
              Your counselor will help you create applications to suitable universities.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* In Progress */}
            {inProgress.length > 0 && (
              <section aria-labelledby="in-progress-heading">
                <h2 id="in-progress-heading" className="mb-4 text-xl font-semibold text-card-foreground">
                  In Progress ({inProgress.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {inProgress.map((app) => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              </section>
            )}

            {/* Submitted */}
            {submitted.length > 0 && (
              <section aria-labelledby="submitted-heading">
                <h2 id="submitted-heading" className="mb-4 text-xl font-semibold text-card-foreground">
                  Submitted ({submitted.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {submitted.map((app) => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              </section>
            )}

            {/* Decided */}
            {decided.length > 0 && (
              <section aria-labelledby="decided-heading">
                <h2 id="decided-heading" className="mb-4 text-xl font-semibold text-card-foreground">
                  Decisions ({decided.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {decided.map((app) => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
