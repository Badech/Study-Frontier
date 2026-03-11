/**
 * Application Validation Schemas
 * Sprint 06: Documents and Applications
 */

import { z } from 'zod';

// ============================================================================
// APPLICATION CREATION
// ============================================================================

export const createApplicationSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  recommendationId: z.string().uuid('Invalid recommendation ID').optional().nullable(),
  schoolName: z.string().min(1, 'School name is required').max(200),
  programName: z.string().min(1, 'Program name is required').max(200),
  degreeLevel: z.string().min(1, 'Degree level is required').max(100),
  intake: z.string().max(50).optional().nullable(),
  submissionDeadline: z.string().optional().nullable(),
  applicationUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  notes: z.string().max(2000).optional().nullable(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

// ============================================================================
// APPLICATION UPDATE
// ============================================================================

export const updateApplicationSchema = z.object({
  schoolName: z.string().min(1).max(200).optional(),
  programName: z.string().min(1).max(200).optional(),
  degreeLevel: z.string().min(1).max(100).optional(),
  intake: z.string().max(50).optional().nullable(),
  status: z.enum([
    'not_started',
    'in_preparation',
    'ready_to_submit',
    'submitted',
    'waiting_for_decision',
    'accepted',
    'rejected',
    'closed',
  ]).optional(),
  submissionDeadline: z.string().optional().nullable(),
  submittedAt: z.string().optional().nullable(),
  decisionDate: z.string().optional().nullable(),
  applicationUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  applicationId: z.string().max(200).optional().nullable(),
  decisionStatus: z.string().max(200).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  nextAction: z.string().max(500).optional().nullable(),
});

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

// ============================================================================
// SCHOOL RECOMMENDATION CREATION
// ============================================================================

export const createSchoolRecommendationSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  schoolName: z.string().min(1, 'School name is required').max(200),
  programName: z.string().min(1, 'Program name is required').max(200),
  degreeLevel: z.string().min(1, 'Degree level is required').max(100),
  location: z.string().max(200).optional().nullable(),
  intake: z.string().max(50).optional().nullable(),
  estimatedTuition: z.string().max(100).optional().nullable(),
  affordabilityLevel: z.enum(['low', 'medium', 'high']).optional().nullable(),
  whyRecommended: z.string().max(2000).optional().nullable(),
  priorityRank: z.number().int().min(1).optional().nullable(),
});

export type CreateSchoolRecommendationInput = z.infer<typeof createSchoolRecommendationSchema>;

// ============================================================================
// APPLICATION STATUS HELPERS
// ============================================================================

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  not_started: 'Not Started',
  in_preparation: 'In Preparation',
  ready_to_submit: 'Ready to Submit',
  submitted: 'Submitted',
  waiting_for_decision: 'Waiting for Decision',
  accepted: 'Accepted',
  rejected: 'Rejected',
  closed: 'Closed',
};

export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-700',
  in_preparation: 'bg-blue-100 text-blue-700',
  ready_to_submit: 'bg-purple-100 text-purple-700',
  submitted: 'bg-yellow-100 text-yellow-700',
  waiting_for_decision: 'bg-orange-100 text-orange-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  closed: 'bg-gray-100 text-gray-700',
};
