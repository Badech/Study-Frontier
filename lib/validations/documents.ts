/**
 * Document Validation Schemas
 * Sprint 06: Documents and Applications
 */

import { z } from 'zod';

// ============================================================================
// DOCUMENT UPLOAD VALIDATION
// ============================================================================

export const documentUploadSchema = z.object({
  documentId: z.string().uuid('Invalid document ID'),
  file: z.instanceof(File, { message: 'File is required' })
    .refine((file) => file.size > 0, 'File cannot be empty')
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => {
        const allowedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        return allowedTypes.includes(file.type);
      },
      'File must be PDF, JPEG, PNG, WEBP, or Word document'
    ),
  uploadType: z.enum(['primary', 'supporting', 'revision']).default('primary'),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;

// ============================================================================
// DOCUMENT CREATION (ADMIN)
// ============================================================================

export const createDocumentSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  documentType: z.string().min(1, 'Document type is required'),
  displayName: z.string().min(1, 'Display name is required').max(200),
  description: z.string().max(1000).optional().nullable(),
  isRequired: z.boolean().default(true),
  category: z.enum(['identity', 'academic', 'financial', 'visa', 'other']).optional().nullable(),
  dueDate: z.string().optional().nullable(),
  priority: z.number().int().min(0).max(10).default(0),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

// ============================================================================
// DOCUMENT REVIEW (ADMIN)
// ============================================================================

export const documentReviewSchema = z.object({
  documentId: z.string().uuid('Invalid document ID'),
  status: z.enum(['approved', 'needs_correction', 'under_review']),
  adminFeedback: z.string().max(2000).optional().nullable(),
});

export type DocumentReviewInput = z.infer<typeof documentReviewSchema>;

// ============================================================================
// DOCUMENT UPDATE
// ============================================================================

export const updateDocumentSchema = z.object({
  displayName: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  isRequired: z.boolean().optional(),
  category: z.enum(['identity', 'academic', 'financial', 'visa', 'other']).optional().nullable(),
  dueDate: z.string().optional().nullable(),
  priority: z.number().int().min(0).max(10).optional(),
});

export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

// ============================================================================
// STANDARD DOCUMENT TYPES
// ============================================================================

export const STANDARD_DOCUMENT_TYPES = [
  {
    type: 'passport',
    displayName: 'Passport',
    description: 'Valid passport (must be valid for at least 6 months beyond intended stay)',
    category: 'identity' as const,
    isRequired: true,
    priority: 10,
  },
  {
    type: 'birth_certificate',
    displayName: 'Birth Certificate',
    description: 'Official birth certificate',
    category: 'identity' as const,
    isRequired: true,
    priority: 8,
  },
  {
    type: 'high_school_transcript',
    displayName: 'High School Transcript',
    description: 'Official high school transcripts with grades',
    category: 'academic' as const,
    isRequired: true,
    priority: 9,
  },
  {
    type: 'university_transcript',
    displayName: 'University Transcript',
    description: 'Official university transcripts (if applicable)',
    category: 'academic' as const,
    isRequired: false,
    priority: 7,
  },
  {
    type: 'diploma',
    displayName: 'Diploma/Degree Certificate',
    description: 'Official diploma or degree certificate',
    category: 'academic' as const,
    isRequired: false,
    priority: 7,
  },
  {
    type: 'english_test_score',
    displayName: 'English Test Score (TOEFL/IELTS)',
    description: 'Official TOEFL or IELTS test score report',
    category: 'academic' as const,
    isRequired: false,
    priority: 8,
  },
  {
    type: 'sat_act_score',
    displayName: 'SAT/ACT Score',
    description: 'SAT or ACT test scores (if required)',
    category: 'academic' as const,
    isRequired: false,
    priority: 6,
  },
  {
    type: 'bank_statement',
    displayName: 'Bank Statement',
    description: 'Recent bank statements showing financial capacity (last 3-6 months)',
    category: 'financial' as const,
    isRequired: true,
    priority: 9,
  },
  {
    type: 'sponsor_letter',
    displayName: 'Sponsor Letter',
    description: 'Affidavit of support from sponsor (if applicable)',
    category: 'financial' as const,
    isRequired: false,
    priority: 7,
  },
  {
    type: 'recommendation_letter',
    displayName: 'Letter of Recommendation',
    description: 'Academic or professional recommendation letter',
    category: 'academic' as const,
    isRequired: false,
    priority: 6,
  },
  {
    type: 'cv_resume',
    displayName: 'CV/Resume',
    description: 'Current curriculum vitae or resume',
    category: 'academic' as const,
    isRequired: false,
    priority: 5,
  },
  {
    type: 'personal_statement',
    displayName: 'Personal Statement/Essay',
    description: 'Personal statement or application essay',
    category: 'academic' as const,
    isRequired: false,
    priority: 5,
  },
  {
    type: 'photo',
    displayName: 'Passport-style Photo',
    description: 'Recent passport-style photograph',
    category: 'identity' as const,
    isRequired: true,
    priority: 6,
  },
] as const;
