/**
 * Document Upload Component
 * Sprint 06: Student document upload with file management
 */

'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { StatusBadge } from '@/components/ui/status-badge';
import type { DocumentWithUploads } from '@/types';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

interface DocumentUploadProps {
  document: DocumentWithUploads;
  onUploadComplete?: () => void;
}

export function DocumentUploadCard({ document, onUploadComplete }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const currentUpload = document.uploads?.find(u => u.is_current);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentId', document.id);
      formData.append('uploadType', currentUpload ? 'revision' : 'primary');

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      // Success
      setSelectedFile(null);
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (document.status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'needs_correction':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'under_review':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'uploaded':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const canUpload = document.status !== 'approved' && document.status !== 'under_review';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">
              {document.display_name}
              {document.is_required && <span className="ml-1 text-red-500">*</span>}
            </h3>
            {document.description && (
              <p className="mt-1 text-sm text-gray-600">{document.description}</p>
            )}
          </div>
        </div>
        <StatusBadge status={document.status} variant="document" />
      </div>

      {/* Current Upload Info */}
      {currentUpload && (
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">Current Upload:</p>
          <p className="text-sm text-gray-600">{currentUpload.file_name}</p>
          <p className="text-xs text-gray-500">
            Uploaded {new Date(currentUpload.uploaded_at).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Admin Feedback */}
      {document.status === 'needs_correction' && document.admin_feedback && (
        <div className="mb-4 rounded-md bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">Admin Feedback:</p>
          <p className="mt-1 text-sm text-red-700">{document.admin_feedback}</p>
        </div>
      )}

      {/* Upload Interface */}
      {canUpload && (
        <div className="space-y-3">
          <FileUpload
            onFileSelect={handleFileSelect}
            currentFile={selectedFile}
            onClearFile={() => setSelectedFile(null)}
            disabled={isUploading}
          />

          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          )}

          {uploadError && (
            <p className="text-sm text-red-600">{uploadError}</p>
          )}
        </div>
      )}

      {document.status === 'under_review' && (
        <p className="text-sm text-yellow-700">
          Your document is currently being reviewed by our team.
        </p>
      )}

      {document.status === 'approved' && (
        <p className="text-sm text-green-700">
          ✓ This document has been approved.
        </p>
      )}

      {document.due_date && (
        <p className="mt-3 text-xs text-gray-500">
          Due: {new Date(document.due_date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
