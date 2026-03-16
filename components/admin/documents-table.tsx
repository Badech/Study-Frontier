/**
 * Admin Documents Table Component
 * Client-side table with document actions (view, download, approve, delete)
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { FileText, Download, CheckCircle, XCircle, Eye, Trash2, ExternalLink } from 'lucide-react';

type DocumentUpload = {
  id: string;
  file_name: string;
  file_size: number | null;
  uploaded_at: string;
  document_id: string;
  student_id: string;
  student?: {
    id: string;
    profile?: {
      full_name: string;
    };
  };
  document?: {
    document_type: string;
    status: string;
    display_name?: string;
  };
};

type DocumentsTableProps = {
  documents: DocumentUpload[];
  onUpdate?: () => void;
};

export function DocumentsTable({ documents, onUpdate }: DocumentsTableProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleView = (doc: DocumentUpload) => {
    console.log('View document:', doc.document_id);
    const url = `/api/documents/${doc.document_id}/view`;
    console.log('Opening URL:', url);
    window.open(url, '_blank');
  };

  const handleDownload = async (doc: DocumentUpload) => {
    try {
      setLoadingAction(`download-${doc.id}`);
      const response = await fetch(`/api/documents/${doc.document_id}/download`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download document');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApprove = async (doc: DocumentUpload) => {
    try {
      setLoadingAction(`approve-${doc.id}`);
      console.log('Approving document:', doc.document_id);
      const response = await fetch(`/api/documents/${doc.document_id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          adminFeedback: 'Document approved',
        }),
      });

      console.log('Approve response:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Approve error response:', errorData);
        throw new Error(errorData.error || 'Approval failed');
      }
      
      alert('Document approved successfully!');
      onUpdate?.();
      window.location.reload(); // Refresh the page to show updated status
    } catch (error) {
      console.error('Approve error:', error);
      setError(error instanceof Error ? error.message : 'Failed to approve document');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (doc: DocumentUpload) => {
    const feedback = prompt('Please provide feedback for the student:');
    if (!feedback) return;

    try {
      setLoadingAction(`reject-${doc.id}`);
      const response = await fetch(`/api/documents/${doc.document_id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'needs_correction',
          adminFeedback: feedback,
        }),
      });

      if (!response.ok) throw new Error('Rejection failed');
      onUpdate?.();
    } catch (error) {
      console.error('Reject error:', error);
      setError('Failed to request revision');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (doc: DocumentUpload) => {
    if (!confirm(`Are you sure you want to delete "${doc.file_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoadingAction(`delete-${doc.id}`);
      console.log('Deleting document:', doc.document_id);
      const response = await fetch(`/api/documents/${doc.document_id}`, {
        method: 'DELETE',
      });

      console.log('Delete response:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete error response:', errorData);
        throw new Error(errorData.error || 'Delete failed');
      }
      
      alert('Document deleted successfully!');
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete document');
    } finally {
      setLoadingAction(null);
    }
  };

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      'missing': 'warning',
      'uploaded': 'warning',
      'under_review': 'warning',
      'approved': 'success',
      'needs_correction': 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No documents found
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">{doc.file_name}</div>
                          {doc.file_size && (
                            <div className="text-xs text-muted-foreground">
                              {(doc.file_size / 1024).toFixed(1)} KB
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {doc.student?.profile?.full_name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm capitalize">
                        {doc.document?.document_type?.replace(/_/g, ' ') || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={doc.document?.status || 'uploaded'} variant="document" />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View"
                          onClick={() => handleView(doc)}
                          disabled={loadingAction !== null}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Download"
                          onClick={() => handleDownload(doc)}
                          disabled={loadingAction !== null}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Approve"
                          onClick={() => handleApprove(doc)}
                          disabled={loadingAction !== null || doc.document?.status === 'approved'}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Request Revision"
                          onClick={() => handleReject(doc)}
                          disabled={loadingAction !== null}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete"
                          onClick={() => handleDelete(doc)}
                          disabled={loadingAction !== null}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
