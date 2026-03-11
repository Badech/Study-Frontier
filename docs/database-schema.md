# Study Frontier - Database Schema Documentation

**Sprint 02: Supabase and Schema**  
**Last Updated:** Sprint 02 Implementation  
**Database:** PostgreSQL via Supabase

---

## Overview

The Study Frontier platform uses a comprehensive PostgreSQL database schema designed to support all features outlined in the PRD. The schema is organized around core entities: users, students, documents, applications, appointments, payments, and administrative workflows.

### Design Principles

1. **Role-Based Access Control (RBAC)** - All tables support user role separation (student, parent, admin, counselor)
2. **Audit Trail** - Activity logging and timestamp tracking on all critical operations
3. **Flexible Storage** - JSONB fields for semi-structured data (DS-160, CMS content, metadata)
4. **Version Control** - Document uploads support versioning and revision tracking
5. **Data Integrity** - Foreign keys, constraints, and triggers enforce referential integrity
6. **Performance** - Strategic indexes on frequently queried columns
7. **Security** - Row Level Security (RLS) policies enforce access control

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐
│ auth.users  │ (Supabase Auth)
└──────┬──────┘
       │
       ├─────────────────────────────────────────────────┐
       │                                                 │
       ▼                                                 ▼
┌─────────────┐                                  ┌──────────────┐
│  profiles   │◄─────────────────────────────────┤ parent_access│
└──────┬──────┘                                  └──────────────┘
       │                                                 │
       │ (role = 'student')                             │
       ▼                                                 │
┌─────────────┐                                         │
│  students   │◄────────────────────────────────────────┘
└──────┬──────┘
       │
       ├──────────┬──────────┬───────────┬──────────┬───────────┬──────────┐
       │          │          │           │          │           │          │
       ▼          ▼          ▼           ▼          ▼           ▼          ▼
┌───────────┐ ┌──────┐ ┌────────┐ ┌──────────┐ ┌───────┐ ┌─────────┐ ┌──────┐
│ documents │ │tasks │ │messages│ │appointments│ │payments│ │applications│ │ds160 │
└─────┬─────┘ └──────┘ └────────┘ └──────────┘ └───┬───┘ └─────────┘ └──────┘
      │                                            │
      ▼                                            ▼
┌──────────────┐                          ┌──────────────┐
│doc_uploads   │                          │installments  │
└──────────────┘                          └──────────────┘

Additional Entities:
- leads (pre-conversion)
- school_recommendations
- student_stage_history
- visa_preparation
- notifications
- activity_log
- cms_content
```

---

## Core Tables

### 1. profiles

Extends Supabase `auth.users` with application-specific profile data.

**Columns:**
- `id` (UUID, PK) - References auth.users(id)
- `email` (TEXT, UNIQUE, NOT NULL)
- `full_name` (TEXT, NOT NULL)
- `role` (TEXT, NOT NULL) - CHECK: 'student', 'parent', 'admin', 'counselor'
- `phone` (TEXT, nullable)
- `whatsapp` (TEXT, nullable)
- `avatar_url` (TEXT, nullable)
- `locale` (TEXT, DEFAULT 'en') - CHECK: 'en', 'fr', 'ar'
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

**Indexes:**
- `idx_profiles_role` on `role`

**Relationships:**
- 1:1 with `students` (when role = 'student')
- 1:N with `parent_access` (as parent)
- 1:N with various entities (as creator/reviewer)

---

### 2. students

Student-specific data and progress tracking.

**Columns:**
- `id` (UUID, PK) - References profiles(id)
- `city` (TEXT, nullable)
- `nationality` (TEXT, DEFAULT 'Morocco')
- `date_of_birth` (DATE, nullable)
- Academic fields: `highest_education`, `current_institution`, `gpa_average`, `english_level`, `test_status`
- Study goals: `desired_study_level`, `intended_major`, `preferred_intake`
- Financial: `budget_range`, `sponsor_type`
- Status: `prior_visa_refusal` (BOOLEAN), `is_active` (BOOLEAN)
- Progress: `current_stage` (TEXT), `stage_updated_at` (TIMESTAMPTZ)
- Admin: `internal_notes` (TEXT), `qualification_label` (TEXT)
- Timestamps: `created_at`, `updated_at`

**Indexes:**
- `idx_students_current_stage` on `current_stage`
- `idx_students_is_active` on `is_active`
- `idx_students_qualification_label` on `qualification_label`

**Stage Values:**
- assessment, planning, documents, applications, visa_preparation, pre_departure, completed

**Qualification Labels:**
- high_potential, needs_followup, budget_mismatch, not_qualified_yet, visa_risk_profile

---

### 3. parent_access

Links parents/sponsors to students with read-only access.

**Columns:**
- `id` (UUID, PK)
- `parent_id` (UUID, FK → profiles.id)
- `student_id` (UUID, FK → students.id)
- `relationship` (TEXT, nullable) - e.g., "father", "mother", "sponsor"
- `is_active` (BOOLEAN, DEFAULT TRUE)
- `created_at` (TIMESTAMPTZ)

**Indexes:**
- `idx_parent_access_student` on `student_id`
- `idx_parent_access_parent` on `parent_id`

**Unique Constraint:** (parent_id, student_id)

---

### 4. leads

Eligibility assessment submissions before student account creation.

**Columns:**
- `id` (UUID, PK)
- Step 1 fields: `full_name`, `email`, `whatsapp`, `phone`, `city`, `nationality`, `age`, `preferred_destination`, `desired_intake`
- Step 2 fields: Academic and financial details (same as students table)
- Tracking: `status`, `qualification_label`, `source`, `converted_to_student_id`
- Admin: `admin_notes`
- Timestamps: `created_at`, `updated_at`

**Lead Status:**
- new, contacted, qualified, converted, not_qualified, archived

**Lead Sources:**
- instagram, facebook, whatsapp, organic, referral, direct, other

**Indexes:**
- `idx_leads_status` on `status`
- `idx_leads_source` on `source`
- `idx_leads_email` on `email`
- `idx_leads_created_at` on `created_at DESC`

---

### 5. documents

Document type tracking and requirements.

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students.id)
- `document_type` (TEXT) - e.g., 'passport', 'transcript', 'bank_statement'
- `display_name` (TEXT)
- `description` (TEXT, nullable)
- `is_required` (BOOLEAN, DEFAULT TRUE)
- `category` (TEXT) - 'identity', 'academic', 'financial', 'visa', 'other'
- `status` (TEXT) - 'missing', 'uploaded', 'under_review', 'needs_correction', 'approved'
- Review: `reviewed_by`, `reviewed_at`, `admin_feedback`
- `due_date` (DATE, nullable)
- `priority` (INTEGER, DEFAULT 0)
- Timestamps: `created_at`, `updated_at`

**Indexes:**
- `idx_documents_student` on `student_id`
- `idx_documents_status` on `status`
- `idx_documents_type` on `document_type`

---

### 6. document_uploads

Individual file uploads with version control.

**Columns:**
- `id` (UUID, PK)
- `document_id` (UUID, FK → documents.id)
- `student_id` (UUID, FK → students.id)
- `file_name` (TEXT)
- `file_path` (TEXT) - Path in Supabase Storage
- `file_size` (INTEGER, nullable)
- `mime_type` (TEXT, nullable)
- `upload_type` (TEXT) - 'primary', 'supporting', 'revision'
- `version` (INTEGER, DEFAULT 1)
- `is_current` (BOOLEAN, DEFAULT TRUE)
- `reviewed` (BOOLEAN, DEFAULT FALSE)
- `uploaded_at` (TIMESTAMPTZ)

**Indexes:**
- `idx_document_uploads_document` on `document_id`
- `idx_document_uploads_student` on `student_id`
- `idx_document_uploads_current` on `(document_id, is_current)`

**Storage Path Pattern:**
```
documents/{student_id}/{document_type}/primary_{timestamp}.pdf
documents/{student_id}/{document_type}/revision_{timestamp}.pdf
documents/{student_id}/{document_type}/supporting_{timestamp}.pdf
```

---

### 7. applications

Track individual school applications.

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students.id)
- `recommendation_id` (UUID, FK → school_recommendations.id, nullable)
- Application details: `school_name`, `program_name`, `degree_level`, `intake`
- `status` (TEXT) - not_started, in_preparation, ready_to_submit, submitted, waiting_for_decision, accepted, rejected, closed
- Important dates: `submission_deadline`, `submitted_at`, `decision_date`
- Details: `application_url`, `application_id`, `decision_status`, `notes`, `next_action`
- `created_by` (UUID, FK → profiles.id)
- Timestamps: `created_at`, `updated_at`

**Indexes:**
- `idx_applications_student` on `student_id`
- `idx_applications_status` on `status`

---

### 8. school_recommendations

Admin-curated school recommendations for students.

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students.id)
- School info: `school_name`, `program_name`, `degree_level`, `location`, `intake`
- Financial: `estimated_tuition`, `affordability_level` ('low', 'medium', 'high')
- Recommendation: `why_recommended`, `priority_rank`
- `is_active` (BOOLEAN, DEFAULT TRUE)
- `recommended_by` (UUID, FK → profiles.id)
- Timestamps: `created_at`, `updated_at`

**Indexes:**
- `idx_school_recs_student` on `student_id`
- `idx_school_recs_active` on `(student_id, is_active)`

---

### 9. appointments

Consultation, document review, and visa coaching sessions.

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students.id)
- `type` (TEXT) - initial_consultation, document_review, visa_coaching, mock_interview, general
- Scheduling: `scheduled_at`, `duration_minutes`, `timezone`
- `status` (TEXT) - scheduled, confirmed, completed, cancelled, no_show
- Details: `title`, `description`, `meeting_url`, `location`
- Participants: `admin_id` (FK → profiles.id)
- Notes: `admin_notes`, `student_notes`
- `reminder_sent` (BOOLEAN, DEFAULT FALSE)
- Timestamps: `created_at`, `updated_at`

**Indexes:**
- `idx_appointments_student` on `student_id`
- `idx_appointments_scheduled` on `scheduled_at`
- `idx_appointments_status` on `status`

---

### 10. payments

Payment tracking and invoice management.

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students.id)
- Payment: `amount` (DECIMAL), `currency` (DEFAULT 'USD'), `package_type`, `description`
- `status` (TEXT) - pending, invoice_sent, paid, partially_paid, overdue, cancelled, refunded
- Payment method: `payment_method`, `payment_provider` (DEFAULT 'paypal'), `external_invoice_id`, `external_payment_id`
- Dates: `due_date`, `paid_at`
- `admin_notes` (TEXT)
- `created_by` (UUID, FK → profiles.id)
- Timestamps: `created_at`, `updated_at`

**Indexes:**
- `idx_payments_student` on `student_id`
- `idx_payments_status` on `status`
- `idx_payments_due_date` on `due_date`

---

### 11. payment_installments

Installment plan tracking.

**Columns:**
- `id` (UUID, PK)
- `payment_id` (UUID, FK → payments.id)
- `student_id` (UUID, FK → students.id)
- `installment_number` (INTEGER)
- `amount` (DECIMAL)
- `description` (TEXT, nullable)
- `status` (TEXT) - pending, paid, overdue, cancelled
- Dates: `due_date`, `paid_at`
- `external_payment_id` (TEXT, nullable)
- Timestamps: `created_at`, `updated_at`

**Indexes:**
- `idx_installments_payment` on `payment_id`
- `idx_installments_student` on `student_id`
- `idx_installments_due_date` on `due_date`

---

### 12. tasks

Admin workflow tasks and student action items.

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students.id)
- Task: `title`, `description`, `category`, `priority` (low, medium, high, urgent)
- Assignment: `assigned_to`, `assigned_by` (FK → profiles.id)
- `status` (TEXT) - pending, in_progress, completed, cancelled, blocked
- Dates: `due_date`, `completed_at`
- `related_stage` (TEXT, nullable)
- `visible_to_student` (BOOLEAN, DEFAULT TRUE)
- Timestamps: `created_at`, `updated_at`

**Indexes:**
- `idx_tasks_student` on `student_id`
- `idx_tasks_status` on `status`
- `idx_tasks_assigned_to` on `assigned_to`
- `idx_tasks_due_date` on `due_date`

---

### 13. messages

Internal messaging system.

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students.id)
- Message: `subject`, `body`
- Participants: `sender_id`, `recipient_id` (FK → profiles.id)
- Status: `is_read`, `read_at`
- `parent_message_id` (UUID, FK → messages.id) - Thread support
- `created_at` (TIMESTAMPTZ)

**Indexes:**
- `idx_messages_student` on `student_id`
- `idx_messages_recipient` on `(recipient_id, is_read)`
- `idx_messages_sender` on `sender_id`
- `idx_messages_thread` on `parent_message_id`

---

### 14. notifications

System notifications for students and admins.

**Columns:**
- `id` (UUID, PK)
- `user_id` (UUID, FK → profiles.id)
- `type` (TEXT) - document_approved, stage_changed, payment_due, appointment_reminder, etc.
- Content: `title`, `message`
- Links: `link_url`, `related_entity_type`, `related_entity_id`
- Status: `is_read`, `read_at`
- Email: `email_sent`, `email_sent_at`
- `created_at` (TIMESTAMPTZ)

**Indexes:**
- `idx_notifications_user` on `(user_id, is_read)`
- `idx_notifications_created` on `created_at DESC`

---

### 15. ds160_data

DS-160 visa form data storage.

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students.id, UNIQUE)
- `form_data` (JSONB) - Flexible storage for all DS-160 sections
- `status` (TEXT) - draft, submitted_for_review, needs_correction, approved, ready_for_submission
- Review: `reviewed_by`, `reviewed_at`, `review_notes`
- Completion: `sections_completed` (TEXT[]), `completion_percentage` (INTEGER)
- Timestamps: `created_at`, `updated_at`

**Important:** This is NOT a direct government submission tool. Platform tracks readiness only.

**Indexes:**
- `idx_ds160_student` on `student_id`
- `idx_ds160_status` on `status`

---

### 16. visa_preparation

Visa readiness tracking and mock interview status.

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students.id, UNIQUE)
- Mock interview: `mock_interview_status`, `last_mock_interview_date`, `mock_interview_notes`
- `checklist_items` (JSONB) - Flexible checklist structure
- `readiness_level` (TEXT) - not_ready, in_progress, nearly_ready, ready
- Interview: `interview_date`, `interview_location` (actual embassy interview)
- `admin_notes` (TEXT)
- Timestamps: `created_at`, `updated_at`

**Indexes:**
- `idx_visa_prep_student` on `student_id`
- `idx_visa_prep_status` on `mock_interview_status`

---

### 17. student_stage_history

Track student progress through stages with timestamps.

**Columns:**
- `id` (UUID, PK)
- `student_id` (UUID, FK → students.id)
- `stage` (TEXT)
- `entered_at` (TIMESTAMPTZ, DEFAULT NOW())
- `completed_at` (TIMESTAMPTZ, nullable)
- `notes` (TEXT, nullable)
- `changed_by` (UUID, FK → profiles.id)

**Indexes:**
- `idx_stage_history_student` on `student_id`
- `idx_stage_history_stage` on `stage`

---

### 18. activity_log

Audit trail for important actions.

**Columns:**
- `id` (UUID, PK)
- `user_id` (UUID, FK → profiles.id, nullable)
- `action_type` (TEXT) - document_uploaded, stage_changed, payment_made, etc.
- Entity: `entity_type`, `entity_id`
- `description` (TEXT)
- `metadata` (JSONB) - Additional context
- Security: `ip_address` (INET), `user_agent` (TEXT)
- `created_at` (TIMESTAMPTZ)

**Indexes:**
- `idx_activity_log_user` on `user_id`
- `idx_activity_log_entity` on `(entity_type, entity_id)`
- `idx_activity_log_created` on `created_at DESC`

---

### 19. cms_content

Editable content blocks for marketing pages.

**Columns:**
- `id` (UUID, PK)
- `page_slug` (TEXT) - homepage, about, services, etc.
- `section_key` (TEXT) - hero, features, faq, etc.
- `locale` (TEXT) - en, fr, ar
- `content` (JSONB) - Flexible content structure
- `is_published` (BOOLEAN, DEFAULT TRUE)
- `last_edited_by` (UUID, FK → profiles.id)
- Timestamps: `created_at`, `updated_at`

**Unique Constraint:** (page_slug, section_key, locale)

**Indexes:**
- `idx_cms_content_page` on `(page_slug, locale)`
- `idx_cms_content_published` on `is_published`

---

## Storage Buckets

### 1. documents
- **Privacy:** Private (RLS enforced)
- **Size Limit:** 10MB per file
- **Allowed Types:** PDF, images, Word documents
- **Structure:** `documents/{student_id}/{document_type}/filename.ext`

### 2. avatars
- **Privacy:** Public
- **Size Limit:** 2MB per file
- **Allowed Types:** Images only (JPEG, PNG, WebP)
- **Structure:** `avatars/{user_id}/avatar_{timestamp}.ext`

### 3. attachments
- **Privacy:** Private (RLS enforced)
- **Size Limit:** 5MB per file
- **Allowed Types:** Documents, images, Excel files
- **Structure:** `attachments/{user_id}/{message_id}/filename.ext`

---

## Row Level Security (RLS) Policies

**Status:** Documented in `lib/supabase/rls-policies.sql`  
**Activation:** Sprint 03 (after auth implementation)

### Policy Summary by Role

**Students:**
- Can view/update their own data
- Can upload documents to their folder
- Can view their tasks, appointments, payments
- Can send/receive messages
- Can manage their DS-160 data

**Parents:**
- Read-only access to linked student data
- Can view student progress, documents, appointments
- Cannot edit or modify anything

**Admins:**
- Full access to all data
- Can manage students, documents, tasks, payments
- Can review and approve submissions
- Can access activity logs

**Counselors:**
- Read access to most student data
- Limited write access (assign tasks, add notes)
- Cannot manage payments or delete data

---

## Triggers and Functions

### update_updated_at_column()
Automatically updates `updated_at` timestamp on row modification.

**Applied to:**
- profiles, students, leads, documents, school_recommendations
- applications, appointments, payments, payment_installments
- tasks, ds160_data, visa_preparation, cms_content

---

## Migration Strategy

### Initial Setup (Sprint 02)
1. Run `lib/supabase/schema.sql` - Creates all tables
2. Run `lib/supabase/storage.sql` - Creates storage buckets
3. Review `lib/supabase/rls-policies.sql` - RLS policies (activate in Sprint 03)

### Future Migrations
- Use timestamped migration files
- Test on development database first
- Always create reversible migrations (up/down)
- Document breaking changes

---

## Performance Considerations

### Indexes
Strategic indexes are created on:
- Foreign keys (automatic performance boost)
- Frequently filtered columns (status, role, stage)
- Date columns used in range queries
- Columns used in JOINs

### Query Optimization
- Use JSONB indexes for frequently queried JSON fields
- Consider materialized views for complex reporting queries
- Implement pagination for large result sets
- Use `SELECT` specific columns instead of `SELECT *`

---

## Data Integrity

### Foreign Keys
All relationships use foreign keys with appropriate CASCADE rules:
- `ON DELETE CASCADE` - Child records deleted when parent deleted (most cases)
- `ON DELETE SET NULL` - Reference nullified when parent deleted (optional relationships)

### Constraints
- CHECK constraints on enum-like fields (role, status, stage)
- UNIQUE constraints on natural keys (email, student-parent pairs)
- NOT NULL constraints on required fields

### Validation
- Database-level validation via constraints
- Application-level validation via Zod schemas (types/validations/)
- Both layers enforce data integrity

---

## Security Best Practices

1. **Never expose service role key to client**
2. **Enable RLS on all tables in production**
3. **Use parameterized queries** (Supabase does this automatically)
4. **Audit sensitive operations** via activity_log
5. **Encrypt sensitive data at rest** (Supabase handles this)
6. **Implement 2FA for admin accounts** (Sprint 03)
7. **Regular security audits** of RLS policies

---

## Maintenance Tasks

### Regular
- Monitor slow queries and optimize indexes
- Clean up old file versions (document_uploads)
- Archive completed student records
- Backup database regularly (automated by Supabase)

### Periodic
- Review and optimize RLS policies
- Update statistics for query planner
- Vacuum and analyze tables
- Review activity logs for security issues

---

## Future Enhancements

### Planned Features
- Materialized views for analytics/reporting
- Full-text search on student profiles
- Automated backup verification
- Database replication for high availability
- Partitioning for large tables (activity_log, notifications)

### Scalability
Current schema supports:
- Up to 10,000 active students efficiently
- Millions of documents with proper indexing
- Real-time notifications via Supabase Realtime
- Horizontal scaling via read replicas

---

## Related Documentation

- **PRD:** `docs/PRD.md` - Product requirements
- **Schema SQL:** `lib/supabase/schema.sql` - Full schema definition
- **RLS Policies:** `lib/supabase/rls-policies.sql` - Security policies
- **Storage Config:** `lib/supabase/storage.sql` - Storage buckets
- **TypeScript Types:** `types/index.ts`, `types/database.ts` - Type definitions

---

## Questions or Issues?

For schema changes or questions:
1. Review PRD requirements first
2. Check existing patterns in schema.sql
3. Consider impact on RLS policies
4. Update TypeScript types accordingly
5. Document changes in this file
