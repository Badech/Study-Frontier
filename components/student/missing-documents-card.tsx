/**
 * Missing Documents Card Component
 * Sprint 04: Shows documents that need student attention
 */

import { FileText, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DashboardCard } from './dashboard-card';
import type { Document } from '@/types';
import { format } from 'date-fns';

interface MissingDocumentsCardProps {
  documents: Document[];
}

export function MissingDocumentsCard({ documents }: MissingDocumentsCardProps) {
  const hasDocuments = documents.length > 0;

  return (
    <DashboardCard
      title="Missing Documents"
      subtitle={hasDocuments ? `${documents.length} document${documents.length !== 1 ? 's' : ''} need${documents.length === 1 ? 's' : ''} your attention` : 'All documents up to date'}
      icon={<FileText className="h-5 w-5" />}
      action={
        hasDocuments ? (
          <a
            href="/dashboard/documents"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All
          </a>
        ) : null
      }
    >
      {!hasDocuments ? (
        <div className="text-center py-6">
          <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            All required documents are uploaded or approved
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.slice(0, 5).map((doc) => (
            <div
              key={doc.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              {/* Document Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {doc.status === 'needs_correction' ? (
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                ) : (
                  <Upload className="h-5 w-5 text-blue-600" />
                )}
              </div>

              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-medium text-sm text-card-foreground">
                    {doc.display_name}
                  </h5>
                  {doc.is_required && (
                    <span className="flex-shrink-0 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                      Required
                    </span>
                  )}
                </div>

                {doc.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {doc.description}
                  </p>
                )}

                {doc.status === 'needs_correction' && doc.admin_feedback && (
                  <p className="text-xs text-orange-700 mt-1.5 bg-orange-50 p-2 rounded border border-orange-200">
                    <span className="font-medium">Admin feedback:</span> {doc.admin_feedback}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="capitalize">
                    {doc.status === 'needs_correction' ? 'Needs Correction' : 'Missing'}
                  </span>
                  {doc.due_date && (
                    <>
                      <span>•</span>
                      <span>Due {format(new Date(doc.due_date), 'MMM dd')}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button className="flex-shrink-0 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Upload
              </button>
            </div>
          ))}

          {documents.length > 5 && (
            <div className="text-center pt-2">
              <a
                href="/dashboard/documents"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View all {documents.length} documents →
              </a>
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
}
