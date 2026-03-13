/**
 * Student Documents Page
 * Sprint 06: Document management and upload interface
 */

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';
import { getStudentDocuments, getDocumentStatusSummary } from '@/lib/data/student';
import { DocumentUploadCard } from '@/components/student/document-upload';
import { FileText, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Documents - Study Frontier',
  description: 'Upload and manage your application documents',
};

export default async function DocumentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/documents');
  }

  if (user.role !== 'student') {
    redirect('/dashboard');
  }

  const documents = await getStudentDocuments(user.id);
  const summary = await getDocumentStatusSummary(user.id);

  // Group documents by category
  const documentsByCategory = documents.reduce((acc, doc) => {
    const category = doc.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  const categoryLabels: Record<string, string> = {
    identity: 'Identity Documents',
    academic: 'Academic Documents',
    financial: 'Financial Documents',
    visa: 'Visa Documents',
    other: 'Other Documents',
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Documents</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Upload and manage your application documents. Required documents are marked with an asterisk (*).
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-card-foreground" aria-label="Total documents">
              {summary.missing + summary.uploaded + summary.underReview + summary.needsCorrection + summary.approved}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Approved</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-green-600" aria-label="Approved documents">{summary.approved}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Under Review</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-yellow-600" aria-label="Documents under review">{summary.underReview}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Need Correction</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-red-600" aria-label="Documents needing correction">{summary.needsCorrection}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Missing</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-muted-foreground" aria-label="Missing documents">{summary.missing}</p>
          </div>
        </div>

        {/* Documents by Category */}
        {documents.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-medium text-card-foreground">No documents yet</h3>
            <p className="mt-2 text-muted-foreground">
              Your counselor will add document requirements to your profile. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(documentsByCategory).map(([category, docs]) => (
              <section key={category} aria-labelledby={`category-${category}`}>
                <h2 id={`category-${category}`} className="mb-4 text-xl font-semibold text-card-foreground">
                  {categoryLabels[category] || 'Other Documents'}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {docs.map((doc) => (
                    <DocumentUploadCard
                      key={doc.id}
                      document={doc}
                      onUploadComplete={async () => {
                        // Revalidate and refresh server component data
                        const { revalidatePath } = await import('next/cache');
                        revalidatePath('/dashboard/documents');
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
