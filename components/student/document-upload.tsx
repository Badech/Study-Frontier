/**
 * Document Upload Component
 * Sprint 06: Student document upload with file management
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { StatusBadge } from '@/components/ui/status-badge';
import type { DocumentWithUploads } from '@/types';
import { CheckCircle, AlertCircle, Clock, XCircle, Upload } from 'lucide-react';

// Simple upload button for document pages
interface SimpleDocumentUploadProps {
  studentId: string;
  documentType: string;
  existingDocument?: any;
}

export function DocumentUpload({ studentId, documentType, existingDocument }: SimpleDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Step 1: Create or get document record
      let documentId = existingDocument?.document_id;
      
      console.log('Existing document:', existingDocument);
      console.log('Document ID:', documentId);
      
      if (!documentId) {
        console.log('Creating new document record...');
        // Create new document record
        const createResponse = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            document_type: documentType,
          }),
        });

        const createData = await createResponse.json();
        console.log('Create response:', createResponse.status, createData);

        if (!createResponse.ok) {
          throw new Error(createData.error || 'Failed to create document record');
        }

        documentId = createData.document.id;
        console.log('Created document ID:', documentId);
      }

      // Step 2: Upload file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentId', documentId);
      formData.append('uploadType', 'primary');

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      alert('Document uploaded successfully!');
      window.location.reload();
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Failed to upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id={`upload-${documentType}`}
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.jpg,.jpeg,.png"
        disabled={isUploading}
      />
      <label htmlFor={`upload-${documentType}`}>
        <Button
          type="button"
          size="sm"
          variant={existingDocument ? "outline" : "default"}
          disabled={isUploading}
          onClick={() => document.getElementById(`upload-${documentType}`)?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : existingDocument ? 'Replace' : 'Upload'}
        </Button>
      </label>
    </div>
  );
}

// Original component for backward compatibility
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
              aria-busy={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          )}

          {uploadError && (
            <p className="text-sm text-red-600" role="alert" aria-live="polite">{uploadError}</p>
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
