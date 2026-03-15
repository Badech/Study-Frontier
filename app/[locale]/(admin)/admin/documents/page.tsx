/**
 * Admin Documents Page
 * View and manage student documents
 */

import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { DocumentsTable } from '@/components/admin/documents-table';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ student?: string }>;
};

export default async function AdminDocumentsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const profile = await getUserProfile();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'counselor')) {
    redirect('/login');
  }

  const searchParamsResolved = await searchParams;
  const studentId = searchParamsResolved.student;

  const supabase = await createClient();

  // Fetch documents (filtered by student if provided)
  const query = supabase
    .from('document_uploads')
    .select(`
      *,
      student:students(
        id,
        profile:profiles(full_name)
      ),
      document:documents(
        document_type,
        status
      )
    `)
    .order('uploaded_at', { ascending: false });

  if (studentId) {
    query.eq('student_id', studentId);
  }

  const { data: documents, error } = await query;

  if (error) {
    console.error('Error fetching documents:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }

  const docs = documents || [];
  
  // If there's an error, show empty state
  if (error && !documents) {
    console.log('Documents query failed, showing empty state');
  }

  // Calculate stats
  const stats = {
    total: docs.length,
    pending: docs.filter(d => ['uploaded', 'under_review', 'missing'].includes(d.document?.status || '')).length,
    approved: docs.filter(d => d.document?.status === 'approved').length,
    needs_revision: docs.filter(d => d.document?.status === 'needs_correction').length,
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Review and manage student documents
          </p>
        </div>
        {studentId && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/admin/documents`}>
              View All Documents
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Documents</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending Review</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-muted-foreground">Approved</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-red-600">{stats.needs_revision}</div>
          <div className="text-sm text-muted-foreground">Needs Revision</div>
        </div>
      </div>

      {/* Documents Table */}
      <DocumentsTable documents={docs} />

      {docs.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
          <p className="text-sm text-muted-foreground">
            Documents uploaded by students will appear here for review.
          </p>
        </div>
      )}
    </div>
  );
}
