/**
 * Admin Student Applications Page
 * Sprint 06: Manage student applications
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/utils';
import { getStudentById } from '@/lib/data/admin';
import { getStudentApplicationsAdmin, getStudentApplicationSummary } from '@/lib/data/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { ArrowLeft, GraduationCap, Plus, Calendar, ExternalLink } from 'lucide-react';
import type { ApplicationWithRecommendation } from '@/types';

export const metadata = {
  title: 'Student Applications - Admin',
};

function ApplicationCard({ application }: { application: ApplicationWithRecommendation }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{application.school_name}</h3>
          <p className="text-sm text-gray-600">{application.program_name}</p>
          <p className="mt-1 text-xs text-gray-500">{application.degree_level}</p>
        </div>
        <StatusBadge status={application.status} variant="application" />
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-4">
        {application.intake && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Intake: {application.intake}</span>
          </div>
        )}

        {application.submission_deadline && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {new Date(application.submission_deadline).toLocaleDateString()}</span>
          </div>
        )}

        {application.submitted_at && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Submitted: {new Date(application.submitted_at).toLocaleDateString()}</span>
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

      {application.next_action && (
        <div className="mt-4 rounded-md bg-blue-50 p-3">
          <p className="text-sm font-medium text-blue-800">Next Action:</p>
          <p className="mt-1 text-sm text-blue-700">{application.next_action}</p>
        </div>
      )}

      {application.notes && (
        <div className="mt-4 rounded-md bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">Notes:</p>
          <p className="mt-1 text-sm text-gray-600">{application.notes}</p>
        </div>
      )}

      {application.created_by && (
        <p className="mt-4 text-xs text-gray-500">
          Created by admin
        </p>
      )}
    </div>
  );
}

export default async function AdminStudentApplicationsPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const student = await getStudentById(params.id);

  if (!student) {
    redirect('/admin/students');
  }

  const applications = await getStudentApplicationsAdmin(params.id);
  const summary = await getStudentApplicationSummary(params.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/students/${params.id}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Student Profile
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Applications - {(student as any).profile?.full_name || 'Student'}
              </h1>
              <p className="mt-2 text-gray-600">
                Manage university applications for this student.
              </p>
            </div>
            <Link
              href={`/admin/students/${params.id}/applications/new`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Application
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{summary.total}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">In Preparation</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">{summary.in_preparation}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Submitted</p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">{summary.submitted}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Accepted</p>
            <p className="mt-2 text-2xl font-bold text-green-600">{summary.accepted}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="mt-2 text-2xl font-bold text-red-600">{summary.rejected}</p>
          </div>
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
            <p className="mt-2 text-gray-600">
              Create the first application for this student.
            </p>
            <Link
              href={`/admin/students/${params.id}/applications/new`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Application
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
