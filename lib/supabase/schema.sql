-- Study Frontier Database Schema
-- Sprint 02: Supabase and Schema
-- This schema supports the full platform requirements from the PRD

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with application-specific profile data
-- ============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'admin', 'counselor')),
  phone TEXT,
  whatsapp TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'fr', 'ar')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster role-based queries
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================================================
-- STUDENTS TABLE
-- Student-specific profile data and progress tracking
-- ============================================================================

CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  city TEXT,
  nationality TEXT DEFAULT 'Morocco',
  date_of_birth DATE,
  
  -- Academic background
  highest_education TEXT,
  current_institution TEXT,
  gpa_average TEXT,
  english_level TEXT,
  test_status TEXT,
  
  -- Study goals
  desired_study_level TEXT,
  intended_major TEXT,
  preferred_intake TEXT,
  
  -- Financial
  budget_range TEXT,
  sponsor_type TEXT,
  
  -- Status flags
  prior_visa_refusal BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Progress tracking
  current_stage TEXT DEFAULT 'assessment' CHECK (
    current_stage IN ('assessment', 'planning', 'documents', 'applications', 'visa_preparation', 'pre_departure', 'completed')
  ),
  stage_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Admin notes
  internal_notes TEXT,
  qualification_label TEXT CHECK (
    qualification_label IS NULL OR 
    qualification_label IN ('high_potential', 'needs_followup', 'budget_mismatch', 'not_qualified_yet', 'visa_risk_profile')
  ),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_students_current_stage ON students(current_stage);
CREATE INDEX idx_students_is_active ON students(is_active);
CREATE INDEX idx_students_qualification_label ON students(qualification_label);

-- ============================================================================
-- PARENT ACCESS TABLE
-- Links parents/sponsors to students with read-only access
-- ============================================================================

CREATE TABLE parent_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT, -- e.g., "father", "mother", "sponsor"
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(parent_id, student_id)
);

CREATE INDEX idx_parent_access_student ON parent_access(student_id);
CREATE INDEX idx_parent_access_parent ON parent_access(parent_id);

-- ============================================================================
-- LEADS TABLE
-- Eligibility assessment submissions before student account creation
-- ============================================================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info (Step 1)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  phone TEXT,
  city TEXT,
  nationality TEXT,
  age INTEGER,
  preferred_destination TEXT,
  desired_intake TEXT,
  
  -- Academic and financial (Step 2)
  highest_education TEXT,
  current_institution TEXT,
  gpa_average TEXT,
  english_level TEXT,
  test_status TEXT,
  desired_study_level TEXT,
  intended_major TEXT,
  budget_range TEXT,
  sponsor_type TEXT,
  prior_visa_refusal BOOLEAN,
  goal_statement TEXT,
  
  -- Tracking
  status TEXT DEFAULT 'new' CHECK (
    status IN ('new', 'contacted', 'qualified', 'converted', 'not_qualified', 'archived')
  ),
  qualification_label TEXT,
  source TEXT, -- 'instagram', 'facebook', 'whatsapp', 'organic', 'referral', 'direct', 'other'
  converted_to_student_id UUID REFERENCES students(id),
  
  -- Admin notes
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lead management
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- ============================================================================
-- STUDENT STAGE HISTORY
-- Track student progress through stages with timestamps
-- ============================================================================

CREATE TABLE student_stage_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  changed_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_stage_history_student ON student_stage_history(student_id);
CREATE INDEX idx_stage_history_stage ON student_stage_history(stage);

-- ============================================================================
-- DOCUMENTS TABLE
-- Document type tracking and requirements
-- ============================================================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Document definition
  document_type TEXT NOT NULL, -- e.g., 'passport', 'transcript', 'bank_statement'
  display_name TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT TRUE,
  category TEXT, -- 'identity', 'academic', 'financial', 'visa', 'other'
  
  -- Status tracking
  status TEXT DEFAULT 'missing' CHECK (
    status IN ('missing', 'uploaded', 'under_review', 'needs_correction', 'approved')
  ),
  
  -- Review
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  admin_feedback TEXT,
  
  -- Metadata
  due_date DATE,
  priority INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_student ON documents(student_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_type ON documents(document_type);

-- ============================================================================
-- DOCUMENT UPLOADS TABLE
-- Individual file uploads with version control
-- ============================================================================

CREATE TABLE document_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- File information
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in Supabase Storage
  file_size INTEGER,
  mime_type TEXT,
  
  -- Upload metadata
  upload_type TEXT DEFAULT 'primary' CHECK (upload_type IN ('primary', 'supporting', 'revision')),
  version INTEGER DEFAULT 1,
  is_current BOOLEAN DEFAULT TRUE,
  
  -- Review
  reviewed BOOLEAN DEFAULT FALSE,
  
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_document_uploads_document ON document_uploads(document_id);
CREATE INDEX idx_document_uploads_student ON document_uploads(student_id);
CREATE INDEX idx_document_uploads_current ON document_uploads(document_id, is_current);

-- ============================================================================
-- SCHOOL RECOMMENDATIONS TABLE
-- Admin-curated school recommendations for students
-- ============================================================================

CREATE TABLE school_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- School information
  school_name TEXT NOT NULL,
  program_name TEXT NOT NULL,
  degree_level TEXT NOT NULL,
  location TEXT,
  intake TEXT,
  
  -- Financial
  estimated_tuition TEXT,
  affordability_level TEXT CHECK (affordability_level IN ('low', 'medium', 'high')),
  
  -- Recommendation
  why_recommended TEXT,
  priority_rank INTEGER,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  recommended_by UUID REFERENCES profiles(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_school_recs_student ON school_recommendations(student_id);
CREATE INDEX idx_school_recs_active ON school_recommendations(student_id, is_active);

-- ============================================================================
-- APPLICATIONS TABLE
-- Track individual school applications
-- ============================================================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES school_recommendations(id) ON DELETE SET NULL,
  
  -- Application details
  school_name TEXT NOT NULL,
  program_name TEXT NOT NULL,
  degree_level TEXT NOT NULL,
  intake TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'not_started' CHECK (
    status IN ('not_started', 'in_preparation', 'ready_to_submit', 'submitted', 
               'waiting_for_decision', 'accepted', 'rejected', 'closed')
  ),
  
  -- Important dates
  submission_deadline DATE,
  submitted_at TIMESTAMPTZ,
  decision_date DATE,
  
  -- Details
  application_url TEXT,
  application_id TEXT,
  decision_status TEXT,
  notes TEXT,
  next_action TEXT,
  
  -- Tracking
  created_by UUID REFERENCES profiles(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_status ON applications(status);

-- ============================================================================
-- APPOINTMENTS TABLE
-- Consultation, document review, and visa coaching sessions
-- ============================================================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Appointment type
  type TEXT NOT NULL CHECK (
    type IN ('initial_consultation', 'document_review', 'visa_coaching', 'mock_interview', 'general')
  ),
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  timezone TEXT DEFAULT 'Africa/Casablanca',
  
  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (
    status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')
  ),
  
  -- Details
  title TEXT NOT NULL,
  description TEXT,
  meeting_url TEXT,
  location TEXT,
  
  -- Participants
  admin_id UUID REFERENCES profiles(id),
  
  -- Notes
  admin_notes TEXT,
  student_notes TEXT,
  
  -- Reminders sent
  reminder_sent BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_student ON appointments(student_id);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================================================
-- PAYMENTS TABLE
-- Payment tracking and invoice management
-- ============================================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Payment details
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  package_type TEXT, -- 'starter', 'application', 'visa_ready'
  description TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'invoice_sent', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded')
  ),
  
  -- Payment method (temporary PayPal, future gateway)
  payment_method TEXT,
  payment_provider TEXT DEFAULT 'paypal',
  external_invoice_id TEXT,
  external_payment_id TEXT,
  
  -- Dates
  due_date DATE,
  paid_at TIMESTAMPTZ,
  
  -- Notes
  admin_notes TEXT,
  
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);

-- ============================================================================
-- PAYMENT INSTALLMENTS TABLE
-- Installment plan tracking
-- ============================================================================

CREATE TABLE payment_installments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Installment details
  installment_number INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'paid', 'overdue', 'cancelled')
  ),
  
  -- Dates
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  
  -- Payment tracking
  external_payment_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_installments_payment ON payment_installments(payment_id);
CREATE INDEX idx_installments_student ON payment_installments(student_id);
CREATE INDEX idx_installments_due_date ON payment_installments(due_date);

-- ============================================================================
-- TASKS TABLE
-- Admin workflow tasks and student action items
-- ============================================================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Task details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'document', 'application', 'visa', 'payment', 'general'
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Assignment
  assigned_to UUID REFERENCES profiles(id),
  assigned_by UUID REFERENCES profiles(id),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'completed', 'cancelled', 'blocked')
  ),
  
  -- Dates
  due_date DATE,
  completed_at TIMESTAMPTZ,
  
  -- Stage association
  related_stage TEXT,
  
  -- Visibility
  visible_to_student BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_student ON tasks(student_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- ============================================================================
-- MESSAGES TABLE
-- Internal messaging system
-- ============================================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Message details
  subject TEXT,
  body TEXT NOT NULL,
  
  -- Participants
  sender_id UUID NOT NULL REFERENCES profiles(id),
  recipient_id UUID NOT NULL REFERENCES profiles(id),
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Thread support
  parent_message_id UUID REFERENCES messages(id),
  
  -- Attachments handled via separate table
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_student ON messages(student_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, is_read);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_thread ON messages(parent_message_id);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- System notifications for students and admins
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Notification details
  type TEXT NOT NULL, -- 'document_approved', 'stage_changed', 'payment_due', 'appointment_reminder', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Links
  link_url TEXT,
  related_entity_type TEXT, -- 'document', 'appointment', 'payment', 'message', etc.
  related_entity_id UUID,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Email notification
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================================================
-- DS-160 DATA TABLE
-- DS-160 visa form data storage
-- ============================================================================

CREATE TABLE ds160_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Form data stored as JSONB for flexibility
  -- Sections: personal, travel, address, family, education, work, security
  form_data JSONB NOT NULL DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (
    status IN ('draft', 'submitted_for_review', 'needs_correction', 'approved', 'ready_for_submission')
  ),
  
  -- Review
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  
  -- Completion tracking
  sections_completed TEXT[], -- Array of completed section names
  completion_percentage INTEGER DEFAULT 0,
  
  -- Important: This is NOT a direct government submission
  -- Platform tracks readiness only
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(student_id) -- One DS-160 per student
);

CREATE INDEX idx_ds160_student ON ds160_data(student_id);
CREATE INDEX idx_ds160_status ON ds160_data(status);

-- ============================================================================
-- VISA PREPARATION TABLE
-- Visa readiness tracking and mock interview status
-- ============================================================================

CREATE TABLE visa_preparation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Mock interview status
  mock_interview_status TEXT DEFAULT 'not_scheduled' CHECK (
    mock_interview_status IN ('not_scheduled', 'scheduled', 'completed', 'needs_another', 'ready_for_interview')
  ),
  last_mock_interview_date DATE,
  mock_interview_notes TEXT,
  
  -- Readiness checklist (stored as JSONB)
  checklist_items JSONB DEFAULT '[]',
  
  -- Overall readiness
  readiness_level TEXT CHECK (
    readiness_level IN ('not_ready', 'in_progress', 'nearly_ready', 'ready')
  ),
  
  -- Interview details (once scheduled with embassy)
  interview_date DATE,
  interview_location TEXT,
  
  -- Notes
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(student_id)
);

CREATE INDEX idx_visa_prep_student ON visa_preparation(student_id);
CREATE INDEX idx_visa_prep_status ON visa_preparation(mock_interview_status);

-- ============================================================================
-- ACTIVITY LOG TABLE
-- Audit trail for important actions
-- ============================================================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Who did what
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'document_uploaded', 'stage_changed', 'payment_made', etc.
  entity_type TEXT, -- 'student', 'document', 'payment', etc.
  entity_id UUID,
  
  -- Details
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- IP tracking for security
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);

-- ============================================================================
-- CMS CONTENT TABLE
-- Editable content blocks for marketing pages
-- ============================================================================

CREATE TABLE cms_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content identification
  page_slug TEXT NOT NULL, -- 'homepage', 'about', 'services', etc.
  section_key TEXT NOT NULL, -- 'hero', 'features', 'faq', etc.
  locale TEXT NOT NULL CHECK (locale IN ('en', 'fr', 'ar')),
  
  -- Content
  content JSONB NOT NULL DEFAULT '{}',
  
  -- Status
  is_published BOOLEAN DEFAULT TRUE,
  
  -- Tracking
  last_edited_by UUID REFERENCES profiles(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(page_slug, section_key, locale)
);

CREATE INDEX idx_cms_content_page ON cms_content(page_slug, locale);
CREATE INDEX idx_cms_content_published ON cms_content(is_published);

-- ============================================================================
-- TRIGGER FUNCTIONS
-- Automatic timestamp updates
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_recs_updated_at BEFORE UPDATE ON school_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installments_updated_at BEFORE UPDATE ON payment_installments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ds160_updated_at BEFORE UPDATE ON ds160_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_prep_updated_at BEFORE UPDATE ON visa_preparation
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON cms_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- Table and column documentation
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE students IS 'Student-specific data and progress tracking';
COMMENT ON TABLE parent_access IS 'Parent/sponsor read-only access to student progress';
COMMENT ON TABLE leads IS 'Eligibility assessment submissions before conversion';
COMMENT ON TABLE documents IS 'Document requirements and status tracking';
COMMENT ON TABLE document_uploads IS 'Individual file uploads with versioning';
COMMENT ON TABLE applications IS 'School/program application tracking';
COMMENT ON TABLE appointments IS 'Consultations, coaching sessions, and meetings';
COMMENT ON TABLE payments IS 'Payment and invoice tracking';
COMMENT ON TABLE payment_installments IS 'Installment payment plans';
COMMENT ON TABLE tasks IS 'Workflow tasks for students and admins';
COMMENT ON TABLE messages IS 'Internal messaging system';
COMMENT ON TABLE notifications IS 'System notifications with email tracking';
COMMENT ON TABLE ds160_data IS 'DS-160 visa form data (intake/review only, not government submission)';
COMMENT ON TABLE visa_preparation IS 'Visa readiness and mock interview tracking';
COMMENT ON TABLE activity_log IS 'Audit trail for security and compliance';
COMMENT ON TABLE cms_content IS 'Editable marketing content in multiple languages';
