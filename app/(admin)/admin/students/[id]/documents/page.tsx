/**
 * Admin Student Documents Page
 * Sprint 06: Review and manage student documents
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/utils';
import { getStudentById } from '@/lib/data/admin';
import { getStudentDocumentsAdmin, getStudentDocumentSummary } from '@/lib/data/admin';
import { DocumentReviewCard } from '@/components/admin/document-review-card';
import { ArrowLeft, FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Student Documents - Admin',
};

export default async function AdminStudentDocumentsPage({
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

  const documents = await getStudentDocumentsAdmin(params.id);
  const summary = await getStudentDocumentSummary(params.id);

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
          <h1 className="text-3xl font-bold text-gray-900">
            Documents - {(student as any).profile?.full_name || 'Student'}
          </h1>
          <p className="mt-2 text-gray-600">
            Review and provide feedback on student documents.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{summary.total}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Approved</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-green-600">{summary.approved}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-gray-600">Under Review</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-yellow-600">{summary.under_review}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-gray-600">Need Correction</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-red-600">{summary.needs_correction}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Missing</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-600">{summary.missing}</p>
          </div>
        </div>

        {/* Documents */}
        {documents.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No documents yet</h3>
            <p className="mt-2 text-gray-600">
              Add document requirements for this student to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {documents.map((doc) => (
              <DocumentReviewCard
                key={doc.id}
                document={doc}
                studentName={(student as any).profile?.full_name || 'Student'}
                onReviewComplete={() => {
                  // Refresh the page
                  window.location.reload();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
