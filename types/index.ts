/**
 * Type definitions for Study Frontier platform
 * These types will be expanded as features are implemented
 */

// User roles
export type UserRole = "student" | "parent" | "admin" | "counselor";

// Student progress stages
export type StudentStage =
  | "assessment"
  | "planning"
  | "documents"
  | "applications"
  | "visa_preparation"
  | "pre_departure";

// Document statuses
export type DocumentStatus =
  | "missing"
  | "uploaded"
  | "under_review"
  | "needs_correction"
  | "approved";

// Application statuses
export type ApplicationStatus =
  | "not_started"
  | "in_preparation"
  | "ready_to_submit"
  | "submitted"
  | "waiting_for_decision"
  | "accepted"
  | "rejected"
  | "closed";

// Placeholder types - to be expanded in future sprints
export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Student extends User {
  full_name: string;
  current_stage: StudentStage;
  // More fields to be added
}

export interface Document {
  id: string;
  student_id: string;
  type: string;
  status: DocumentStatus;
  // More fields to be added
}
