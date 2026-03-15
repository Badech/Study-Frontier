/**
 * Student Documents Page
 * Sprint 04: Student Portal - Documents Management
 */

import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { DocumentUpload } from '@/components/student/document-upload';
import { StatusBadge } from '@/components/ui/status-badge';
import { FileText, CheckCircle, XCircle, Clock, Upload } from 'lucide-react';

export const dynamic = 'force-dynamic';

type DocumentCategory = {
  name: string;
  description: string;
  types: {
    id: string;
    label: string;
    required: boolean;
  }[];
};

const documentCategories: DocumentCategory[] = [
  {
    name: 'Personal Documents',
    description: 'Identity and personal information',
    types: [
      { id: 'passport', label: 'Passport Copy', required: true },
      { id: 'national_id', label: 'National ID', required: true },
      { id: 'photo', label: 'Passport Photo', required: true },
      { id: 'birth_certificate', label: 'Birth Certificate', required: false },
    ],
  },
  {
    name: 'Academic Documents',
    description: 'Educational records and transcripts',
    types: [
      { id: 'high_school_transcript', label: 'High School Transcript', required: true },
      { id: 'high_school_diploma', label: 'High School Diploma', required: true },
      { id: 'bachelor_transcript', label: "Bachelor's Transcript", required: false },
      { id: 'bachelor_diploma', label: "Bachelor's Diploma", required: false },
      { id: 'academic_certificates', label: 'Academic Certificates', required: false },
    ],
  },
  {
    name: 'Financial Documents',
    description: 'Bank statements and sponsor letters',
    types: [
      { id: 'bank_statement', label: 'Bank Statement', required: true },
      { id: 'sponsor_letter', label: 'Sponsor Letter', required: false },
      { id: 'affidavit_support', label: 'Affidavit of Support', required: false },
    ],
  },
  {
    name: 'Test Scores',
    description: 'Standardized test results',
    types: [
      { id: 'toefl', label: 'TOEFL Score', required: false },
      { id: 'ielts', label: 'IELTS Score', required: false },
      { id: 'sat', label: 'SAT Score', required: false },
      { id: 'gre', label: 'GRE Score', required: false },
    ],
  },
  {
    name: 'Other Documents',
    description: 'Additional supporting materials',
    types: [
      { id: 'cv', label: 'Resume/CV', required: false },
      { id: 'letter_recommendation', label: 'Letter of Recommendation', required: false },
      { id: 'statement_purpose', label: 'Statement of Purpose', required: false },
      { id: 'other', label: 'Other Documents', required: false },
    ],
  },
];

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const profile = await getUserProfile();

  if (!profile) {
    redirect(`/${locale}/login?redirect=/${locale}/dashboard/documents`);
  }

  // Fetch user's uploaded documents
  const supabase = await createClient();
  const { data: uploads } = await supabase
    .from('document_uploads')
    .select(`
      *,
      document:documents(*)
    `)
    .eq('student_id', profile.id)
    .order('uploaded_at', { ascending: false });

  const documents = uploads || [];

  // Group documents by type
  const documentsByType = documents.reduce((acc: any, doc: any) => {
    const type = doc.document?.document_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {});

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'needs_revision':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      'pending': 'warning',
      'approved': 'success',
      'needs_revision': 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Documents</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Upload and manage your application documents
        </p>
      </div>

      {/* Upload Instructions */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <h3 className="font-semibold text-sm mb-2">📎 Upload Guidelines</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Upload clear, readable scans or photos of your documents</li>
          <li>• Accepted formats: PDF, JPG, PNG (Max 5MB per file)</li>
          <li>• Required documents are marked with a red asterisk (*)</li>
          <li>• Our team will review and approve your documents within 2-3 business days</li>
        </ul>
      </div>

      {/* Document Categories */}
      {documentCategories.map((category) => (
        <div key={category.name} className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
          <p className="text-sm text-muted-foreground mb-6">{category.description}</p>

          <div className="space-y-4">
            {category.types.map((type) => {
              const existingDocs = documentsByType[type.id] || [];
              const latestDoc = existingDocs[0];
              const latestDocData = latestDoc?.document;

              return (
                <div
                  key={type.id}
                  className="rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">
                          {type.label}
                          {type.required && <span className="text-destructive ml-1">*</span>}
                        </h3>
                        {latestDocData && (
                          <div className="flex items-center gap-1">
                            {getStatusIcon(latestDocData.status)}
                            <StatusBadge status={getStatusColor(latestDocData.status)} className="text-xs">
                              {latestDocData.status}
                            </StatusBadge>
                          </div>
                        )}
                      </div>

                      {latestDoc && (
                        <div className="text-sm text-muted-foreground">
                          <div>{latestDoc.file_name}</div>
                          <div className="text-xs">
                            Uploaded {new Date(latestDoc.uploaded_at).toLocaleDateString()}
                          </div>
                          {latestDocData?.admin_notes && (
                            <div className="mt-2 p-2 rounded bg-muted text-xs">
                              <strong>Admin feedback:</strong> {latestDocData.admin_notes}
                            </div>
                          )}
                        </div>
                      )}

                      {!latestDoc && type.required && (
                        <div className="text-sm text-destructive">
                          Required - Not uploaded yet
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <DocumentUpload
                        studentId={profile.id}
                        documentType={type.id}
                        existingDocument={latestDoc}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Summary Stats */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Summary</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.document?.status === 'approved').length}
            </div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {documents.filter(d => d.document?.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {documents.filter(d => d.document?.status === 'needs_revision').length}
            </div>
            <div className="text-sm text-muted-foreground">Needs Revision</div>
          </div>
        </div>
      </div>
    </div>
  );
}
