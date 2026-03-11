1.  FINAL PROPOSED ARCHITECTURE

                                    System Architecture

• Framework: Next.js 15+ App Router (currently 16.1.6)
• Language: TypeScript 5+ (strict mode)
• Runtime: React 19.2.3
• Styling: Tailwind CSS 4.x (PostCSS-based)
• Backend: Supabase (PostgreSQL, Auth, Storage, RLS)
• Deployment: Vercel (Edge Functions where beneficial)
• Package Manager: pnpm with workspace support

                                       Application Layers

1 Public Marketing Layer - Unauthenticated, SEO-optimized, i18n-enabled
2 Student Portal Layer - Authenticated, mobile-first, progress-driven
3 Admin Dashboard Layer - Authenticated, desktop-first, action-oriented
4 Parent/Sponsor View Layer - Authenticated, read-only, limited visibility

                                  Key Architectural Principles

• Mobile-first for public + student portal
• Desktop-first for admin dashboard
• Server Components by default, Client Components only when needed
• Edge rendering for marketing pages
• RLS (Row Level Security) enforced at database level
• Provider abstraction for payments
• Type-safe validation with Zod at all boundaries

────────────────────────────────────────────────────────────────────────────────────────────────

                                          2. ROUTE MAP

```
/
├── (marketing)/                    # Public website route group
│   ├── page.tsx                   # Homepage
│   ├── about/page.tsx             # About page
│   ├── services/page.tsx          # Services & packages
│   ├── study-usa/page.tsx         # Study in the USA
│   ├── process/page.tsx           # Our Process
│   ├── institutions/page.tsx      # For Institutions
│   ├── contact/page.tsx           # Contact
│   ├── assessment/page.tsx        # Eligibility Assessment (2-step form)
│   ├── privacy/page.tsx           # Privacy Policy
│   ├── terms/page.tsx             # Terms & Conditions
│   ├── refund-policy/page.tsx     # Refund/Cancellation Policy
│   └── faq/page.tsx               # FAQ
│
├── (student)/                     # Student portal route group
│   ├── dashboard/page.tsx         # Student dashboard (Next Action, Progress)
│   ├── documents/page.tsx         # Document management
│   ├── applications/page.tsx      # Applications tracking
│   ├── visa/page.tsx              # Visa preparation module
│   ├── ds160/page.tsx             # DS-160 workflow
│   ├── appointments/page.tsx      # Appointments booking/viewing
│   ├── payments/page.tsx          # Payment history & installments
│   ├── messages/page.tsx          # Message center
│   ├── profile/page.tsx           # Student profile
│   └── onboarding/page.tsx        # Initial onboarding flow
│
├── (admin)/                       # Admin dashboard route group
│   ├── dashboard/page.tsx         # Admin home (action-first)
│   ├── leads/page.tsx             # Lead management
│   ├── leads/[id]/page.tsx        # Individual lead detail
│   ├── students/page.tsx          # Student list
│   ├── students/[id]/page.tsx     # Student detail/operations
│   ├── documents/page.tsx         # Document review queue
│   ├── applications/page.tsx      # Applications oversight
│   ├── appointments/page.tsx      # Appointment management
│   ├── payments/page.tsx          # Payment tracking & invoicing
│   ├── tasks/page.tsx             # Task management
│   ├── messages/page.tsx          # Message center
│   ├── analytics/page.tsx         # Reporting & analytics
│   ├── cms/page.tsx               # Content management
│   └── settings/page.tsx          # Admin settings
│
├── (parent)/                      # Parent/sponsor view route group
│   ├── dashboard/page.tsx         # Read-only student progress
│   └── updates/page.tsx           # Key updates & milestones
│
├── auth/                          # Auth routes (non-grouped)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── callback/route.ts          # Supabase auth callback
│
└── api/                           # API routes
    ├── webhooks/
    │   └── paypal/route.ts        # PayPal webhook handler (future)
    ├── notifications/route.ts     # Notification triggers
    └── assessment/route.ts        # Assessment form submission
```

────────────────────────────────────────────────────────────────────────────────────────────────

                                   3. DOMAIN MODEL / ENTITIES

                                         Core Entities

User (Supabase Auth + extended profile)

• id (UUID, PK)
• email
• role (student | parent | admin | counselor)
• created_at
• last_login

Student Profile

• id (UUID, PK)
• user_id (FK → users)
• full_name
• whatsapp_number
• city
• nationality
• date_of_birth
• current_stage (enum: assessment | planning | documents | applications | visa_preparation |  
 pre_departure)
• assigned_admin_id (FK → users)
• package_type (starter | application | visa_ready)
• is_active
• created_at
• updated_at

Lead

• id (UUID, PK)
• full_name
• email
• whatsapp_number
• city
• nationality
• age
• preferred_destination
• desired_intake
• education_level
• current_institution
• gpa
• english_level
• test_status
• desired_study_level
• intended_major
• budget_range
• sponsor_type
• prior_visa_refusal
• goal_statement
• qualification_label (high_potential | needs_followup | budget_mismatch | not_qualified |  
 visa_risk)
• source (instagram | facebook | whatsapp | organic | referral | direct | other)
• converted_to_student_id (FK → students, nullable)
• status (new | contacted | qualified | converted | declined)
• created_at
• updated_at

Document

• id (UUID, PK)
• student_id (FK → students)
• document_type (passport | transcript | diploma | bank_statement | sponsor_letter | etc.)  
 • file_url (Supabase Storage path)
• file_name
• file_size
• mime_type
• status (missing | uploaded | under_review | needs_correction | approved)
• uploaded_at
• reviewed_at
• reviewed_by (FK → users, nullable)
• correction_notes
• version (integer, for re-uploads)
• is_current_version (boolean)

Application

• id (UUID, PK)
• student_id (FK → students)
• school_name
• program_name
• degree_level (bachelor | master | community_college | esl)
• intake (fall_2026 | spring_2027 | etc.)
• application_status (not_started | in_preparation | ready_to_submit | submitted |
waiting_decision | accepted | rejected | closed)
• submission_date
• decision_date
• decision_status
• tuition_estimate
• location
• why_recommended
• required_documents (JSON array)
• notes
• next_action
• created_at
• updated_at

DS160Form

• id (UUID, PK)
• student_id (FK → students)
• form_data (JSONB - structured sections)
• completion_percentage
• status (draft | submitted_for_review | needs_correction | approved | ready_for_government)  
 • submitted_at
• reviewed_at
• reviewed_by (FK → users, nullable)
• review_notes
• last_saved_at

Appointment

• id (UUID, PK)
• student_id (FK → students)
• appointment_type (initial_consultation | document_review | visa_coaching)
• scheduled_at
• duration_minutes
• status (scheduled | completed | cancelled | no_show)
• meeting_link
• notes
• created_at
• updated_at

Payment

• id (UUID, PK)
• student_id (FK → students)
• amount
• currency (USD | MAD)
• payment_type (deposit | installment | full_payment)
• status (pending | paid | overdue | refunded)
• due_date
• paid_date
• payment_method (paypal | bank_transfer | future_gateway)
• external_invoice_id (PayPal invoice ID)
• installment_number (nullable)
• notes
• created_at
• updated_at

PaymentPlan

• id (UUID, PK)
• student_id (FK → students)
• total_amount
• currency
• package_type
• number_of_installments
• created_at

Task

• id (UUID, PK)
• student_id (FK → students)
• title
• description
• task_type (system_generated | custom)
• status (pending | in_progress | completed | cancelled)
• priority (high | medium | low)
• assigned_to (FK → users, nullable)
• due_date
• completed_at
• created_at
• updated_at

Message

• id (UUID, PK)
• student_id (FK → students)
• sender_id (FK → users)
• recipient_id (FK → users)
• subject
• body
• is_read
• sent_at

Notification

• id (UUID, PK)
• user_id (FK → users)
• notification_type (document_approved | stage_changed | payment_due | appointment_reminder |  
 etc.)
• title
• message
• is_read
• related_entity_type (document | payment | appointment | etc.)
• related_entity_id (UUID, nullable)
• created_at

VisaPreparation

• id (UUID, PK)
• student_id (FK → students)
• mock_interview_status (not_scheduled | scheduled | completed | needs_another | ready)
• mock_interview_date
• visa_interview_date
• checklist_items (JSONB)
• coaching_notes
• next_action
• updated_at

ParentLink

• id (UUID, PK)
• parent_user_id (FK → users)
• student_id (FK → students)
• relationship (parent | sponsor | guardian)
• created_at

CMSContent (for editable marketing content)

• id (UUID, PK)
• content_key (unique: homepage_hero | about_story | etc.)
• locale (en | fr | ar)
• content (JSONB - structured content blocks)
• updated_by (FK → users)
• updated_at

AuditLog

• id (UUID, PK)
• user_id (FK → users)
• action (document_uploaded | document_approved | stage_changed | etc.)
• entity_type
• entity_id
• changes (JSONB)
• ip_address
• created_at

────────────────────────────────────────────────────────────────────────────────────────────────

                                    4. DATABASE SCHEMA DRAFT

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('student', 'parent', 'admin', 'counselor');
CREATE TYPE student_stage AS ENUM ('assessment', 'planning', 'documents', 'applications',
'visa_preparation', 'pre_departure');
CREATE TYPE package_type AS ENUM ('starter', 'application', 'visa_ready');
CREATE TYPE document_status AS ENUM ('missing', 'uploaded', 'under_review', 'needs_correction',
'approved');
CREATE TYPE application_status AS ENUM ('not_started', 'in_preparation', 'ready_to_submit',
'submitted', 'waiting_decision', 'accepted', 'rejected', 'closed');
CREATE TYPE degree_level AS ENUM ('bachelor', 'master', 'community_college', 'esl');
CREATE TYPE appointment_type AS ENUM ('initial_consultation', 'document_review',
'visa_coaching');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'refunded');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE lead_qualification AS ENUM ('high_potential', 'needs_followup', 'budget_mismatch',
'not_qualified', 'visa_risk');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'declined');
CREATE TYPE ds160_status AS ENUM ('draft', 'submitted_for_review', 'needs_correction',
'approved', 'ready_for_government');
CREATE TYPE mock_interview_status AS ENUM ('not_scheduled', 'scheduled', 'completed',
'needs_another', 'ready');

-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  whatsapp_number TEXT NOT NULL,
  city TEXT,
  nationality TEXT DEFAULT 'Morocco',
  date_of_birth DATE,
  current_stage student_stage DEFAULT 'assessment',
  assigned_admin_id UUID REFERENCES user_profiles(id),
  package_type package_type,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  city TEXT,
  nationality TEXT,
  age INTEGER,
  preferred_destination TEXT,
  desired_intake TEXT,
  education_level TEXT,
  current_institution TEXT,
  gpa TEXT,
  english_level TEXT,
  test_status TEXT,
  desired_study_level TEXT,
  intended_major TEXT,
  budget_range TEXT,
  sponsor_type TEXT,
  prior_visa_refusal BOOLEAN,
  goal_statement TEXT,
  qualification_label lead_qualification,
  source TEXT,
  converted_to_student_id UUID REFERENCES students(id),
  status lead_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  status document_status DEFAULT 'missing',
  uploaded_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES user_profiles(id),
  correction_notes TEXT,
  version INTEGER DEFAULT 1,
  is_current_version BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  program_name TEXT NOT NULL,
  degree_level degree_level NOT NULL,
  intake TEXT,
  application_status application_status DEFAULT 'not_started',
  submission_date DATE,
  decision_date DATE,
  decision_status TEXT,
  tuition_estimate TEXT,
  location TEXT,
  why_recommended TEXT,
  required_documents JSONB,
  notes TEXT,
  next_action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DS-160 Forms
CREATE TABLE ds160_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  form_data JSONB DEFAULT '{}',
  completion_percentage INTEGER DEFAULT 0,
  status ds160_status DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES user_profiles(id),
  review_notes TEXT,
  last_saved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  appointment_type appointment_type NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status appointment_status DEFAULT 'scheduled',
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Plans
CREATE TABLE payment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  package_type package_type NOT NULL,
  number_of_installments INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  payment_plan_id UUID REFERENCES payment_plans(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_type TEXT,
  status payment_status DEFAULT 'pending',
  due_date DATE,
  paid_date DATE,
  payment_method TEXT,
  external_invoice_id TEXT,
  installment_number INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT,
  status task_status DEFAULT 'pending',
  priority task_priority DEFAULT 'medium',
  assigned_to UUID REFERENCES user_profiles(id),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES user_profiles(id),
  recipient_id UUID NOT NULL REFERENCES user_profiles(id),
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visa Preparation
CREATE TABLE visa_preparation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  mock_interview_status mock_interview_status DEFAULT 'not_scheduled',
  mock_interview_date TIMESTAMPTZ,
  visa_interview_date DATE,
  checklist_items JSONB DEFAULT '[]',
  coaching_notes TEXT,
  next_action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent Links
CREATE TABLE parent_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_user_id, student_id)
);

-- CMS Content
CREATE TABLE cms_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_key TEXT NOT NULL,
  locale TEXT NOT NULL,
  content JSONB NOT NULL,
  updated_by UUID REFERENCES user_profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_key, locale)
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  changes JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_stage ON students(current_stage);
CREATE INDEX idx_students_admin ON students(assigned_admin_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_documents_student ON documents(student_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_appointments_student ON appointments(student_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_tasks_student ON tasks(student_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_messages_student ON messages(student_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

────────────────────────────────────────────────────────────────────────────────────────────────

                                     5. AUTH AND ROLES PLAN

                                    Authentication Strategy

• Provider: Supabase Auth
• Methods: Email/Password (primary), Magic Link (optional future)
• Session Management: Server-side with @supabase/ssr
• MFA: Required for admin users

                                Role-Based Access Control (RBAC)

Student Role

• Can access: Student portal only
• Can view: Own profile, documents, applications, visa prep, appointments, payments, messages  
 • Can create: Documents (upload), appointment bookings, messages
• Can update: Own profile, DS-160 form data
• Cannot access: Admin dashboard, other students' data

Parent Role

• Can access: Parent view only
• Can view: Linked student's current stage, next steps, major milestones
• Cannot view: Internal notes, full document details, admin-only information
• Cannot create/update: Anything (read-only)

Admin Role

• Can access: Admin dashboard, view all students
• Can view: Everything
• Can create: Students, tasks, applications, appointments, payment requests, messages
• Can update: Student stages, document statuses, task statuses, lead labels
• Can delete: Documents (soft delete), tasks (cancel)

Counselor Role (Future)

• Can access: Admin dashboard (limited)
• Can view: Assigned students only
• Can update: Document reviews, tasks, notes
• Cannot access: Payments, analytics, CMS, settings

                                          RLS Policies

```sql
-- Students table: Users can only see their own student record
CREATE POLICY "Students can view own record"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

-- Parents can view linked students
CREATE POLICY "Parents can view linked students"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_links
      WHERE parent_links.parent_user_id = auth.uid()
      AND parent_links.student_id = students.id
    )
  );

-- Admins can view all students
CREATE POLICY "Admins can view all students"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Similar patterns for documents, applications, messages, etc.
```

                                     Middleware Protection

• Route groups protected by middleware checking auth state
• Role verification at route level
• API routes protected with service role key or user JWT validation

────────────────────────────────────────────────────────────────────────────────────────────────

                                       6. I18N STRUCTURE

                                         Implementation

• Library: next-intl 4.8.3
• Languages: English (en), French (fr), Arabic (ar)
• Strategy: Manual translation for critical pages, hybrid for secondary content

                                         File Structure

```
/messages/
  ├── en.json          # English translations
  ├── fr.json          # French translations
  └── ar.json          # Arabic translations
```

                                       Routing Structure

```
/[locale]/
  ├── (marketing)/...  # Translated marketing pages
  ├── (student)/...    # Translated student portal
  └── (admin)/...      # Admin dashboard (English primary)
```

                                       Translation Scope

Fully Translated (All 3 Languages)

• Homepage
• About page
• Services page
• Study in USA page
• Our Process page
• Contact page
• Assessment form
• FAQ
• Legal pages
• Student portal UI
• Form labels and validation messages

English Primary with Basic Translation

• Admin dashboard (English primary, basic UI translation)
• CMS content (admin can manage translations)

                                          RTL Support

• Tailwind CSS RTL plugin for Arabic
• dir="rtl" applied automatically for Arabic locale
• Mirrored layouts for Arabic (navigation, forms, etc.)
• Separate CSS handling for RTL-specific adjustments

                                        Locale Detection

1 URL path (/en, /fr, /ar)
2 User preference (stored in profile)
3 Browser language header (fallback)
4 Default to English

────────────────────────────────────────────────────────────────────────────────────────────────

                              7. PAYMENT/PROVIDER ABSTRACTION PLAN

                             Architecture Pattern: Strategy Pattern

```typescript
// lib/payments/types.ts
interface PaymentProvider {
  createInvoice(data: InvoiceData): Promise<Invoice>;
  getInvoiceStatus(invoiceId: string): Promise<InvoiceStatus>;
  refundPayment(paymentId: string, amount: number): Promise<Refund>;
  webhookHandler(request: Request): Promise<WebhookEvent>;
}

// lib/payments/providers/paypal.ts
class PayPalProvider implements PaymentProvider {
  // PayPal-specific implementation
}

// lib/payments/providers/moroccan-gateway.ts (future)
class MoroccanGatewayProvider implements PaymentProvider {
  // Future Moroccan gateway implementation
}

// lib/payments/factory.ts
function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER || "paypal";
  switch (provider) {
    case "paypal":
      return new PayPalProvider();
    case "moroccan":
      return new MoroccanGatewayProvider();
    default:
      throw new Error(`Unknown payment provider: ${provider}`);
  }
}
```

                            Phase 1: PayPal Business Invoices (MVP)

Flow:

1 Admin creates payment request in dashboard
2 System generates payment record with status 'pending'
3 Admin manually creates PayPal invoice (external)
4 Admin enters PayPal invoice ID into system
5 Student receives notification with payment link
6 Admin manually marks as paid when confirmed
7 System updates payment status and triggers notifications

Why: Fast to market, uses existing PayPal Business account

                             Phase 2: Moroccan Gateway Integration

Flow:

1 Admin creates payment request
2 System automatically creates invoice via API
3 Student clicks "Pay Now" in portal
4 Redirects to payment gateway
5 Webhook confirms payment
6 System auto-updates payment status
7 Notifications sent automatically

Providers to Research:

• CMI (Centre Monétique Interbancaire)
• Maroc Telecommerce (MTC)
• PayZone
• Local bank gateways

                                        Database Support

• payment_method field stores provider type
• external_invoice_id stores provider-specific ID
• Provider abstraction allows seamless switching

────────────────────────────────────────────────────────────────────────────────────────────────

                                        8. SPRINT ORDER

Sprint 00: Bootstrap ✓ (Per plan)

• Next.js setup, Tailwind config, folder structure, base layout

Sprint 01: Marketing Site

• Public pages (Home, About, Services, Study USA, Process, Institutions, Contact)
• Eligibility Assessment form (2-step)
• FAQ and policy pages
• Mobile-responsive, premium aesthetic

Sprint 02: Supabase and Schema

• Supabase project setup
• Database schema implementation
• RLS policies
• Storage buckets
• Initial seed data

Sprint 03: Auth and Roles

• Supabase Auth integration
• User profiles
• Role-based middleware
• Login/signup flows
• Password reset
• Protected routes

Sprint 04: Student Portal

• Student dashboard (Next Action, Progress)
• Profile management
• Progress timeline
• Onboarding flow
• Basic navigation

Sprint 05: Admin Dashboard

• Admin dashboard home (action-first)
• Lead management
• Student list and detail views
• Basic task management
• Navigation and layout

Sprint 06: Documents and Applications

• Document upload/management (student side)
• Document review (admin side)
• Application tracking (both sides)
• Status workflows
• File storage integration

Sprint 07: DS-160 and Visa

• DS-160 form workflow
• Visa preparation module
• Mock interview tracking
• Visa checklist
• Review system

Sprint 08: Payments and Notifications

• Payment plan creation
• Payment tracking
• PayPal invoice integration (manual)
• Notification system
• Email notifications
• Message center

Sprint 09: CMS and i18n

• next-intl setup
• Translation files
• RTL support for Arabic
• CMS for marketing content
• Locale switching

Sprint 10: Hardening and Release

• Security audit
• Performance optimization
• Analytics integration
• Error handling
• Documentation
• Deployment preparation
• Launch checklist

────────────────────────────────────────────────────────────────────────────────────────────────

                                   9. KEY RISKS AND BLOCKERS

                                        Technical Risks

1. Supabase RLS Complexity

• Risk: Complex permission logic with parent/student/admin roles
• Mitigation: Start simple, test thoroughly, use service role for admin operations where needed  
 • Sprint affected: 02, 03

2. File Upload Security

• Risk: Handling sensitive documents (passports, visas)
• Mitigation: Strong RLS on storage buckets, audit logging, virus scanning (future)
• Sprint affected: 06

3. DS-160 Form Complexity

• Risk: Large form with many sections, autosave, validation
• Mitigation: Break into manageable sections, use Zod for validation, incremental saves
• Sprint affected: 07

4. Payment Provider Integration

• Risk: Manual PayPal process is error-prone
• Mitigation: Clear admin workflow, validation checks, payment status reconciliation
• Sprint affected: 08

5. i18n with RTL

• Risk: Arabic RTL layout bugs, translation quality
• Mitigation: Test RTL early, professional translation for critical pages
• Sprint affected: 09

                                         Business Risks

1. Scope Creep

• Risk: PRD is comprehensive, could delay launch
• Mitigation: Strict sprint adherence, MVP mindset, defer non-critical features
• All sprints

2. Content Creation

• Risk: Need high-quality content in 3 languages
• Mitigation: English first, professional translation, CMS for iterative updates
• Sprint 01, 09

3. Payment Gateway Availability

• Risk: Moroccan gateway integration may be complex/delayed
• Mitigation: Start with PayPal, abstract early, migrate later
• Sprint 08

                                            Blockers

Immediate:

• ✅ None - ready to bootstrap

Sprint 02:

• Need Supabase project credentials
• Need to finalize document types list

Sprint 08:

• Need PayPal Business account credentials
• Need to decide on installment plan rules

Sprint 09:

• Need translation vendor or tool
• Need finalized marketing copy in English first

Sprint 10:

• Need production Vercel account
• Need domain name and DNS access
• Need production Supabase instance

                                          Dependencies

Critical Path:

```
Bootstrap → Supabase Setup → Auth → Portal/Admin (parallel) → Documents → Visa → Payments → i18n
→ Hardening
```

Parallel Workstreams:

• Marketing site can be built alongside portal (Sprint 01 + 04)
• Admin dashboard can be built alongside student portal (Sprint 04 + 05)
• CMS and i18n can start earlier if content is ready

                                     Mitigation Strategies

For RLS Complexity:

─── Response ─────────────────────────────────────────────────────────────────────────────────────
Sprint 09:

• Need translation vendor or tool
• Need finalized marketing copy in English first

Sprint 10:

• Need production Vercel account
• Need domain name and DNS access
• Need production Supabase instance

                                          Dependencies

Critical Path:

```
Bootstrap → Supabase Setup → Auth → Portal/Admin (parallel) → Documents → Visa → Payments → i18n
→ Hardening
```

Parallel Workstreams:

• Marketing site can be built alongside portal (Sprint 01 + 04)
• Admin dashboard can be built alongside student portal (Sprint 04 + 05)
• CMS and i18n can start earlier if content is ready

                                     Mitigation Strategies

For RLS Complexity:

1 Create helper functions for common policies
2 Use policy templates
3 Test with each role manually
4 Create test users for each role
5 Document policy logic in comments

For File Upload Security:

1 Enforce file type restrictions
2 Use Supabase storage RLS policies
3 Generate signed URLs with expiration
4 Add audit logging for document access
5 Implement file size limits

For DS-160 Form:

1 Use react-hook-form with field arrays
2 Implement autosave with debouncing
3 Store as JSON in database
4 Add progress indicator
5 Allow section-by-section completion
6 Add validation summary

For Payment Provider:

1 Build abstraction layer from day 1
2 Keep PayPal logic isolated
3 Design database schema to support multiple providers
4 Add webhook support in architecture
5 Plan for async payment confirmation

For i18n/RTL:

1 Use next-intl from start
2 Structure components for RTL support
3 Test with dir="rtl" early
4 Use logical CSS properties (inline-start vs left)
5 Avoid hardcoded text in components

────────────────────────────────────────────────────────────────────────────────────────────────

                                      IMPLEMENTATION NOTES

                                  Phase 1 (MVP - Launch Ready)

• Sprints: 00-08
• Timeline: ~10-12 weeks
• Goal: Functional platform with English-only, PayPal payments, core workflows
• Excludes: Full i18n, advanced CMS, automated payments

                                       Phase 2 (Enhanced)

• Sprints: 09-10
• Timeline: +4-6 weeks
• Goal: Multi-language, polished UX, performance optimized
• Includes: Full i18n, RTL support, CMS, hardening

                                        Phase 3 (Scale)

• Post-launch
• Features: Moroccan payment gateway, advanced analytics, counselor role, mobile apps
• As needed based on traction

────────────────────────────────────────────────────────────────────────────────────────────────

                                    DESIGN SYSTEM FOUNDATION

                           Color Palette (from globals.css variables)

```
Primary: Blue-based (trust, professionalism)
Secondary: Gold/amber accent (premium)
Background: White/gray gradient
Text: Charcoal black
Success: Green
Warning: Amber
Error: Red
```

                                           Typography

• Headings: Geist Sans (clean, modern)
• Body: Geist Sans
• Mono: Geist Mono (for codes, technical data)

                                    Component Library Needs

• Button variants (primary, secondary, outline, ghost)
• Form inputs (text, select, textarea, file upload)
• Cards (info, action, stats)
• Tables (responsive, sortable)
• Modals/dialogs
• Toast notifications
• Progress indicators
• Breadcrumbs
• Tabs
• Badges
• Avatar
• Empty states
• Loading states
• Error states

                                       Reusable Patterns

• Dashboard stat cards
• Timeline component (for student progress)
• Document upload zone
• Status badges
• Action buttons with icons
• Filter/search bars
• Pagination
• Navigation menus (side nav, top nav)

────────────────────────────────────────────────────────────────────────────────────────────────

                                         QUALITY GATES

                                    Per Sprint Exit Criteria

Code Quality:

• ✅ TypeScript strict mode, no any types
• ✅ All imports use @/\* alias where appropriate
• ✅ ESLint passes with no warnings
• ✅ Components are properly typed
• ✅ Zod schemas for all form inputs

Functionality:

• ✅ Feature works on mobile and desktop
• ✅ All user roles tested
• ✅ Error states handled gracefully
• ✅ Loading states implemented
• ✅ Edge cases considered

Security:

• ✅ RLS policies implemented
• ✅ Input validation with Zod
• ✅ No sensitive data in client code
• ✅ Proper authentication checks
• ✅ CSRF protection where needed

UX/Design:

• ✅ Matches premium aesthetic
• ✅ Mobile-responsive (for student/marketing)
• ✅ Desktop-optimized (for admin)
• ✅ Consistent spacing and typography
• ✅ Clear CTAs and navigation

Documentation:

• ✅ Complex logic has comments
• ✅ API routes documented
• ✅ Database schema changes noted
• ✅ Environment variables documented

────────────────────────────────────────────────────────────────────────────────────────────────

                                        TESTING STRATEGY

                                           Unit Tests

• Utility functions (lib/)
• Zod schemas
• Helper functions
• Validation logic

                                       Integration Tests

• API routes
• Auth flows
• Database operations
• File uploads

                                   E2E Tests (Critical Paths)

• Student onboarding
• Document submission
• Admin review workflow
• Payment creation
• DS-160 form completion
• Application tracking

                                    Manual Testing Checklist

• [ ] Test on iOS Safari
• [ ] Test on Android Chrome
• [ ] Test on desktop Chrome, Firefox, Safari
• [ ] Test all user roles
• [ ] Test dark mode (if implemented)
• [ ] Test RTL layout (post Sprint 09)
• [ ] Test with slow network
• [ ] Test with ad blockers
• [ ] Test accessibility (keyboard nav, screen readers)

────────────────────────────────────────────────────────────────────────────────────────────────

                                      DEPLOYMENT STRATEGY

                                          Environments

Development:

• Local development with hot reload
• Local Supabase instance (optional)
• Development Supabase project

Staging:

• Vercel preview deployments
• Staging Supabase project
• Test PayPal sandbox

Production:

• Vercel production
• Production Supabase project
• Live PayPal Business account

                                         CI/CD Pipeline

1 Push to feature branch
2 Vercel creates preview deployment
3 ESLint runs automatically
4 Manual testing on preview
5 PR review and approval
6 Merge to main
7 Automatic production deployment
8 Smoke tests on production

                                         Rollback Plan

• Use Vercel instant rollback
• Database migrations are reversible
• Keep previous deployment accessible

────────────────────────────────────────────────────────────────────────────────────────────────

                                      PERFORMANCE TARGETS

                                        Core Web Vitals

• LCP (Largest Contentful Paint): < 2.5s
• FID (First Input Delay): < 100ms
• CLS (Cumulative Layout Shift): < 0.1

                                        Page Load Times

• Marketing pages: < 2s (first load)
• Portal pages: < 3s (authenticated)
• Admin dashboard: < 3s (data-heavy)

                                    Optimization Techniques

• Next.js Image optimization
• Static page generation for marketing
• ISR (Incremental Static Regeneration) where beneficial
• Code splitting and lazy loading
• Font optimization with next/font
• Minimize client-side JavaScript
• Use Server Components by default

────────────────────────────────────────────────────────────────────────────────────────────────

                                   ACCESSIBILITY REQUIREMENTS

                                  WCAG 2.1 Level AA Compliance

• ✅ Keyboard navigation
• ✅ Screen reader support
• ✅ Color contrast ratios (4.5:1 for text)
• ✅ Focus indicators
• ✅ Alt text for images
• ✅ Semantic HTML
• ✅ ARIA labels where needed
• ✅ Form labels and error messages
• ✅ Skip navigation links

                                     Special Considerations

• Arabic RTL users
• Mobile-only users (many Moroccan students)
• Low bandwidth scenarios
• Touch-friendly targets (44x44px minimum)

────────────────────────────────────────────────────────────────────────────────────────────────

                                    MONITORING AND ANALYTICS

                                         Error Tracking

• Sentry or similar (post-launch)
• Client-side error boundary
• Server-side error logging
• API error monitoring

                                           Analytics

• Vercel Analytics (built-in)
• Google Analytics (optional)
• Custom event tracking:
• Assessment form submissions
• Contact form submissions
• Student progress milestones
• Document uploads
• Payment completions

                                     Performance Monitoring

• Vercel Speed Insights
• Core Web Vitals tracking
• API response times
• Database query performance

                                         User Feedback

• Message center for direct communication
• Admin can track common issues
• Post-launch: NPS surveys

────────────────────────────────────────────────────────────────────────────────────────────────

                                  SECURITY HARDENING CHECKLIST

                                    Sprint 10 Specific Tasks

• [ ] Security audit of all RLS policies
• [ ] Review all API routes for auth checks
• [ ] Verify no sensitive data in client bundles
• [ ] Check for SQL injection vulnerabilities
• [ ] Validate all user inputs
• [ ] Implement rate limiting on sensitive endpoints
• [ ] Add CORS configuration
• [ ] Review environment variables
• [ ] Scan dependencies for vulnerabilities
• [ ] Implement CSP (Content Security Policy)
• [ ] Add security headers (Vercel config)
• [ ] Test with OWASP Top 10 checklist
• [ ] Document security best practices
• [ ] Create incident response plan

────────────────────────────────────────────────────────────────────────────────────────────────

                                        CONTENT STRATEGY

                                    Marketing Content Needs

Homepage:

• Hero headline and subheading
• Value propositions (3-4 key benefits)
• Trust indicators (partner logos when available)
• Clear CTA
• Social proof (when available, NO fake testimonials)

About Page:

• Founder story and credentials
• Mission and values
• Why Morocco → USA
• Team (when applicable)

Services Page:

• Package comparison
• What's included in each tier
• Process overview
• Pricing guidance (ranges, not exact)

Study USA Page:

• Benefits of studying in USA
• Realistic requirements
• Timeline expectations
• Common challenges

Process Page:

• Step-by-step workflow
• What students do vs what we do
• Timeline per stage
• Transparency about effort required

FAQ:

• Common questions about USA admissions
• Visa process questions
• Service-specific questions
• Pricing and payment questions
• Realistic advice, no guarantees

                                        Tone Guidelines

• 70% informative and clear
• 30% premium and aspirational
• No jargon
• No false promises
• Realistic about challenges
• Emphasize guidance and support

────────────────────────────────────────────────────────────────────────────────────────────────

                                   OPEN QUESTIONS TO RESOLVE

                                        Before Sprint 02

1 Exact document types required (for schema)?
2 Specific fields needed for DS-160 review?
3 Installment plan rules (# of installments, deadlines)?

                                        Before Sprint 08

4 PayPal Business account credentials?
5 Email notification template designs?
6 SMS provider for WhatsApp integration?

                                        Before Sprint 09

7 Translation vendor or use AI-assisted?
8 Priority order for which pages to translate first?
9 RTL design mockups for Arabic?

                                        Before Sprint 10

10 Production domain name?
11 Google Analytics tracking ID (if using)?
12 Privacy policy legal review?

────────────────────────────────────────────────────────────────────────────────────────────────

                                 SUCCESS METRICS (POST-LAUNCH)

                                       Leading Indicators

• Assessment form completion rate
• Contact form submissions
• Time on site
• Pages per session
• Mobile vs desktop traffic

                                       Conversion Metrics

• Assessment → Lead conversion
• Lead → Student conversion
• Payment completion rate
• Document upload completion rate
• Application submission rate

                                      Operational Metrics

• Admin response time
• Document review turnaround time
• Student satisfaction (via messages)
• Progress velocity (stage transitions)

                                        Business Metrics

• Monthly new students
• Revenue per student
• Package distribution
• Referral rate
• Churn/cancellation rate
