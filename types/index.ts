/**
 * Type definitions for Study Frontier platform
 * Sprint 02: Comprehensive database-aligned types
 */

// ============================================================================
// ENUMS AND LITERAL TYPES
// ============================================================================

export type UserRole = "student" | "parent" | "admin" | "counselor";

export type Locale = "en" | "fr" | "ar";

export type StudentStage =
  | "assessment"
  | "planning"
  | "documents"
  | "applications"
  | "visa_preparation"
  | "pre_departure"
  | "completed";

export type DocumentStatus =
  | "missing"
  | "uploaded"
  | "under_review"
  | "needs_correction"
  | "approved";

export type DocumentCategory =
  | "identity"
  | "academic"
  | "financial"
  | "visa"
  | "other";

export type DocumentUploadType = "primary" | "supporting" | "revision";

export type ApplicationStatus =
  | "not_started"
  | "in_preparation"
  | "ready_to_submit"
  | "submitted"
  | "waiting_for_decision"
  | "accepted"
  | "rejected"
  | "closed";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "not_qualified"
  | "archived";

export type QualificationLabel =
  | "high_potential"
  | "needs_followup"
  | "budget_mismatch"
  | "not_qualified_yet"
  | "visa_risk_profile";

export type AppointmentType =
  | "initial_consultation"
  | "document_review"
  | "visa_coaching"
  | "mock_interview"
  | "general";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentStatus =
  | "pending"
  | "invoice_sent"
  | "paid"
  | "partially_paid"
  | "overdue"
  | "cancelled"
  | "refunded";

export type InstallmentStatus = "pending" | "paid" | "overdue" | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "blocked";

export type DS160Status =
  | "draft"
  | "submitted_for_review"
  | "needs_correction"
  | "approved"
  | "ready_for_submission";

export type MockInterviewStatus =
  | "not_scheduled"
  | "scheduled"
  | "completed"
  | "needs_another"
  | "ready_for_interview";

export type VisaReadinessLevel =
  | "not_ready"
  | "in_progress"
  | "nearly_ready"
  | "ready";

export type AffordabilityLevel = "low" | "medium" | "high";

export type LeadSource =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "organic"
  | "referral"
  | "direct"
  | "other";

// ============================================================================
// DATABASE TABLE TYPES
// ============================================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  locale: Locale;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  city: string | null;
  nationality: string;
  date_of_birth: string | null;
  highest_education: string | null;
  current_institution: string | null;
  gpa_average: string | null;
  english_level: string | null;
  test_status: string | null;
  desired_study_level: string | null;
  intended_major: string | null;
  preferred_intake: string | null;
  budget_range: string | null;
  sponsor_type: string | null;
  prior_visa_refusal: boolean;
  is_active: boolean;
  current_stage: StudentStage;
  stage_updated_at: string;
  internal_notes: string | null;
  qualification_label: QualificationLabel | null;
  created_at: string;
  updated_at: string;
}

export interface ParentAccess {
  id: string;
  parent_id: string;
  student_id: string;
  relationship: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string | null;
  phone: string | null;
  city: string | null;
  nationality: string | null;
  age: number | null;
  preferred_destination: string | null;
  desired_intake: string | null;
  highest_education: string | null;
  current_institution: string | null;
  gpa_average: string | null;
  english_level: string | null;
  test_status: string | null;
  desired_study_level: string | null;
  intended_major: string | null;
  budget_range: string | null;
  sponsor_type: string | null;
  prior_visa_refusal: boolean | null;
  goal_statement: string | null;
  status: LeadStatus;
  qualification_label: string | null;
  source: LeadSource | null;
  converted_to_student_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentStageHistory {
  id: string;
  student_id: string;
  stage: string;
  entered_at: string;
  completed_at: string | null;
  notes: string | null;
  changed_by: string | null;
}

export interface Document {
  id: string;
  student_id: string;
  document_type: string;
  display_name: string;
  description: string | null;
  is_required: boolean;
  category: DocumentCategory | null;
  status: DocumentStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_feedback: string | null;
  due_date: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentUpload {
  id: string;
  document_id: string;
  student_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  upload_type: DocumentUploadType;
  version: number;
  is_current: boolean;
  reviewed: boolean;
  uploaded_at: string;
}

export interface SchoolRecommendation {
  id: string;
  student_id: string;
  school_name: string;
  program_name: string;
  degree_level: string;
  location: string | null;
  intake: string | null;
  estimated_tuition: string | null;
  affordability_level: AffordabilityLevel | null;
  why_recommended: string | null;
  priority_rank: number | null;
  is_active: boolean;
  recommended_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  student_id: string;
  recommendation_id: string | null;
  school_name: string;
  program_name: string;
  degree_level: string;
  intake: string | null;
  status: ApplicationStatus;
  submission_deadline: string | null;
  submitted_at: string | null;
  decision_date: string | null;
  application_url: string | null;
  application_id: string | null;
  decision_status: string | null;
  notes: string | null;
  next_action: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  student_id: string;
  type: AppointmentType;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  status: AppointmentStatus;
  title: string;
  description: string | null;
  meeting_url: string | null;
  location: string | null;
  admin_id: string | null;
  admin_notes: string | null;
  student_notes: string | null;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  currency: string;
  package_type: string | null;
  description: string | null;
  status: PaymentStatus;
  payment_method: string | null;
  payment_provider: string;
  external_invoice_id: string | null;
  external_payment_id: string | null;
  due_date: string | null;
  paid_at: string | null;
  admin_notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentInstallment {
  id: string;
  payment_id: string;
  student_id: string;
  installment_number: number;
  amount: number;
  description: string | null;
  status: InstallmentStatus;
  due_date: string;
  paid_at: string | null;
  external_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  student_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: TaskPriority;
  assigned_to: string | null;
  assigned_by: string | null;
  status: TaskStatus;
  due_date: string | null;
  completed_at: string | null;
  related_stage: string | null;
  visible_to_student: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  student_id: string;
  subject: string | null;
  body: string;
  sender_id: string;
  recipient_id: string;
  is_read: boolean;
  read_at: string | null;
  parent_message_id: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link_url: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  is_read: boolean;
  read_at: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
}

export interface DS160Data {
  id: string;
  student_id: string;
  form_data: Record<string, any>;
  status: DS160Status;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  sections_completed: string[] | null;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface VisaPreparation {
  id: string;
  student_id: string;
  mock_interview_status: MockInterviewStatus;
  last_mock_interview_date: string | null;
  mock_interview_notes: string | null;
  checklist_items: any[];
  readiness_level: VisaReadinessLevel | null;
  interview_date: string | null;
  interview_location: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action_type: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string | null;
  metadata: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface CMSContent {
  id: string;
  page_slug: string;
  section_key: string;
  locale: Locale;
  content: Record<string, any>;
  is_published: boolean;
  last_edited_by: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// COMPOSITE/JOINED TYPES
// ============================================================================

// Student with profile information
export interface StudentWithProfile extends Student {
  profile: Profile;
}

// Document with upload information
export interface DocumentWithUploads extends Document {
  uploads: DocumentUpload[];
}

// Application with school recommendation
export interface ApplicationWithRecommendation extends Application {
  recommendation: SchoolRecommendation | null;
}

// Task with assignee information
export interface TaskWithAssignee extends Task {
  assignee: Profile | null;
  assigner: Profile | null;
}

// Message with sender/recipient profiles
export interface MessageWithProfiles extends Message {
  sender: Profile;
  recipient: Profile;
}

// Payment with installments
export interface PaymentWithInstallments extends Payment {
  installments: PaymentInstallment[];
}

// ============================================================================
// FORM INPUT TYPES
// ============================================================================

// Lead/Eligibility Assessment Form
export interface LeadFormData {
  // Step 1: Basic info
  full_name: string;
  email: string;
  whatsapp?: string;
  phone?: string;
  city?: string;
  nationality?: string;
  age?: number;
  preferred_destination?: string;
  desired_intake?: string;

  // Step 2: Academic and financial
  highest_education?: string;
  current_institution?: string;
  gpa_average?: string;
  english_level?: string;
  test_status?: string;
  desired_study_level?: string;
  intended_major?: string;
  budget_range?: string;
  sponsor_type?: string;
  prior_visa_refusal?: boolean;
  goal_statement?: string;
}

// Student profile update
export interface StudentProfileUpdate {
  full_name?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  date_of_birth?: string;
  highest_education?: string;
  current_institution?: string;
  gpa_average?: string;
  english_level?: string;
  test_status?: string;
  desired_study_level?: string;
  intended_major?: string;
  preferred_intake?: string;
  budget_range?: string;
  sponsor_type?: string;
}

// Document upload metadata
export interface DocumentUploadMetadata {
  document_id: string;
  file_name: string;
  upload_type: DocumentUploadType;
  version: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ============================================================================
// DASHBOARD/UI TYPES
// ============================================================================

export interface DashboardStats {
  total_students: number;
  active_students: number;
  pending_documents: number;
  upcoming_appointments: number;
  pending_payments: number;
  new_leads: number;
}

export interface StudentDashboardData {
  student: StudentWithProfile;
  next_action: Task | null;
  missing_documents: Document[];
  upcoming_appointments: Appointment[];
  recent_notifications: Notification[];
  payment_summary: {
    total_due: number;
    total_paid: number;
    overdue_count: number;
  };
}

export interface AdminDashboardData {
  stats: DashboardStats;
  pending_tasks: Task[];
  new_leads: Lead[];
  students_by_stage: Record<StudentStage, number>;
  upcoming_appointments: Appointment[];
  recent_activity: ActivityLog[];
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}
