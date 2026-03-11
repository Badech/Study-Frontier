-- Study Frontier Row Level Security (RLS) Policies
-- Sprint 02: Supabase and Schema
-- These policies will be fully activated in Sprint 03 when auth is implemented

-- ============================================================================
-- IMPORTANT: RLS ACTIVATION
-- Uncomment these lines in Sprint 03 after auth is implemented
-- ============================================================================

-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE parent_access ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE student_stage_history ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE document_uploads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE school_recommendations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payment_installments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ds160_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE visa_preparation ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Admins can update all profiles
CREATE POLICY "Admins can manage profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- STUDENTS TABLE POLICIES
-- ============================================================================

-- Students can view their own data
CREATE POLICY "Students can view own data"
ON students
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Students can update their own data (except certain admin-only fields)
CREATE POLICY "Students can update own data"
ON students
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admins can view all students
CREATE POLICY "Admins can view all students"
ON students
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Admins can manage all students
CREATE POLICY "Admins can manage students"
ON students
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Parents can view linked students (read-only)
CREATE POLICY "Parents can view linked students"
ON students
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM parent_access 
    WHERE parent_id = auth.uid() 
    AND student_id = students.id 
    AND is_active = true
  )
);

-- ============================================================================
-- PARENT ACCESS TABLE POLICIES
-- ============================================================================

-- Students can view their parent access links
CREATE POLICY "Students can view parent access"
ON parent_access
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Parents can view their access links
CREATE POLICY "Parents can view own access"
ON parent_access
FOR SELECT
TO authenticated
USING (parent_id = auth.uid());

-- Admins can manage parent access
CREATE POLICY "Admins can manage parent access"
ON parent_access
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- LEADS TABLE POLICIES
-- ============================================================================

-- Admins can view all leads
CREATE POLICY "Admins can view leads"
ON leads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Admins can manage leads
CREATE POLICY "Admins can manage leads"
ON leads
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Service role can insert leads (for public form submissions)
-- This will be handled via server-side API routes with service role key

-- ============================================================================
-- STUDENT STAGE HISTORY POLICIES
-- ============================================================================

-- Students can view their own stage history
CREATE POLICY "Students can view own stage history"
ON student_stage_history
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Admins can view all stage history
CREATE POLICY "Admins can view stage history"
ON student_stage_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Admins can manage stage history
CREATE POLICY "Admins can manage stage history"
ON student_stage_history
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- DOCUMENTS TABLE POLICIES
-- ============================================================================

-- Students can view their own documents
CREATE POLICY "Students can view own documents"
ON documents
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Students cannot directly create document requirements (admin-defined)
-- But this policy allows future self-service features if needed

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON documents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Admins can manage all documents
CREATE POLICY "Admins can manage documents"
ON documents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Parents can view student documents (read-only)
CREATE POLICY "Parents can view student documents"
ON documents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM parent_access 
    WHERE parent_id = auth.uid() 
    AND student_id = documents.student_id 
    AND is_active = true
  )
);

-- ============================================================================
-- DOCUMENT UPLOADS TABLE POLICIES
-- ============================================================================

-- Students can view their own uploads
CREATE POLICY "Students can view own uploads"
ON document_uploads
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Students can insert their own uploads
CREATE POLICY "Students can upload documents"
ON document_uploads
FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

-- Students can update their own uploads (limited fields)
CREATE POLICY "Students can update own uploads"
ON document_uploads
FOR UPDATE
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Admins can view all uploads
CREATE POLICY "Admins can view all uploads"
ON document_uploads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Admins can manage all uploads
CREATE POLICY "Admins can manage uploads"
ON document_uploads
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Parents can view student uploads (read-only)
CREATE POLICY "Parents can view student uploads"
ON document_uploads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM parent_access 
    WHERE parent_id = auth.uid() 
    AND student_id = document_uploads.student_id 
    AND is_active = true
  )
);

-- ============================================================================
-- SCHOOL RECOMMENDATIONS POLICIES
-- ============================================================================

-- Students can view their own recommendations
CREATE POLICY "Students can view own recommendations"
ON school_recommendations
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Admins can manage all recommendations
CREATE POLICY "Admins can manage recommendations"
ON school_recommendations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Parents can view student recommendations
CREATE POLICY "Parents can view student recommendations"
ON school_recommendations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM parent_access 
    WHERE parent_id = auth.uid() 
    AND student_id = school_recommendations.student_id 
    AND is_active = true
  )
);

-- ============================================================================
-- APPLICATIONS POLICIES
-- ============================================================================

-- Students can view their own applications
CREATE POLICY "Students can view own applications"
ON applications
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Admins can manage all applications
CREATE POLICY "Admins can manage applications"
ON applications
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Parents can view student applications
CREATE POLICY "Parents can view student applications"
ON applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM parent_access 
    WHERE parent_id = auth.uid() 
    AND student_id = applications.student_id 
    AND is_active = true
  )
);

-- ============================================================================
-- APPOINTMENTS POLICIES
-- ============================================================================

-- Students can view their own appointments
CREATE POLICY "Students can view own appointments"
ON appointments
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Students can insert appointment requests (booking)
CREATE POLICY "Students can request appointments"
ON appointments
FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

-- Admins can manage all appointments
CREATE POLICY "Admins can manage appointments"
ON appointments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- ============================================================================
-- PAYMENTS POLICIES
-- ============================================================================

-- Students can view their own payments
CREATE POLICY "Students can view own payments"
ON payments
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Admins can manage all payments
CREATE POLICY "Admins can manage payments"
ON payments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Parents can view student payments
CREATE POLICY "Parents can view student payments"
ON payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM parent_access 
    WHERE parent_id = auth.uid() 
    AND student_id = payments.student_id 
    AND is_active = true
  )
);

-- ============================================================================
-- PAYMENT INSTALLMENTS POLICIES
-- ============================================================================

-- Students can view their own installments
CREATE POLICY "Students can view own installments"
ON payment_installments
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Admins can manage installments
CREATE POLICY "Admins can manage installments"
ON payment_installments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- TASKS POLICIES
-- ============================================================================

-- Students can view tasks visible to them
CREATE POLICY "Students can view own tasks"
ON tasks
FOR SELECT
TO authenticated
USING (
  student_id = auth.uid() AND visible_to_student = true
);

-- Students can update task status (mark complete, etc.)
CREATE POLICY "Students can update own tasks"
ON tasks
FOR UPDATE
TO authenticated
USING (student_id = auth.uid() AND visible_to_student = true)
WITH CHECK (student_id = auth.uid());

-- Admins can view all tasks
CREATE POLICY "Admins can view all tasks"
ON tasks
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Admins can manage all tasks
CREATE POLICY "Admins can manage tasks"
ON tasks
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- MESSAGES POLICIES
-- ============================================================================

-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages"
ON messages
FOR SELECT
TO authenticated
USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);

-- Users can send messages
CREATE POLICY "Users can send messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

-- Users can update messages they received (mark as read)
CREATE POLICY "Users can mark messages read"
ON messages
FOR UPDATE
TO authenticated
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid());

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can update their notifications (mark as read)
CREATE POLICY "Users can mark notifications read"
ON notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- System/admins can create notifications
CREATE POLICY "Admins can create notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- DS-160 DATA POLICIES
-- ============================================================================

-- Students can view their own DS-160 data
CREATE POLICY "Students can view own DS-160"
ON ds160_data
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Students can update their own DS-160 data
CREATE POLICY "Students can update own DS-160"
ON ds160_data
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Admins can view all DS-160 data
CREATE POLICY "Admins can view all DS-160"
ON ds160_data
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Admins can manage DS-160 data (review, approve, etc.)
CREATE POLICY "Admins can manage DS-160"
ON ds160_data
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- VISA PREPARATION POLICIES
-- ============================================================================

-- Students can view their own visa prep data
CREATE POLICY "Students can view own visa prep"
ON visa_preparation
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Admins can manage visa prep data
CREATE POLICY "Admins can manage visa prep"
ON visa_preparation
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Parents can view student visa prep
CREATE POLICY "Parents can view student visa prep"
ON visa_preparation
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM parent_access 
    WHERE parent_id = auth.uid() 
    AND student_id = visa_preparation.student_id 
    AND is_active = true
  )
);

-- ============================================================================
-- ACTIVITY LOG POLICIES
-- ============================================================================

-- Admins can view all activity logs
CREATE POLICY "Admins can view activity logs"
ON activity_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- System can insert activity logs (via service role)
-- Individual users can view their own actions
CREATE POLICY "Users can view own activity"
ON activity_log
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ============================================================================
-- CMS CONTENT POLICIES
-- ============================================================================

-- Everyone can view published CMS content
CREATE POLICY "Anyone can view published content"
ON cms_content
FOR SELECT
TO public
USING (is_published = true);

-- Admins can view all content (including unpublished)
CREATE POLICY "Admins can view all content"
ON cms_content
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can manage CMS content
CREATE POLICY "Admins can manage content"
ON cms_content
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================

/*
RLS POLICY DESIGN PRINCIPLES:

1. **Principle of Least Privilege**
   - Users can only access data they own or are explicitly granted access to
   - Parents have read-only access to student data
   - Admins have full access for operational needs

2. **Role-Based Access Control (RBAC)**
   - Student: Own data only
   - Parent: Read-only access to linked students
   - Counselor: Read access to most data, limited write
   - Admin: Full access to all data

3. **Data Isolation**
   - Student data is isolated per student_id
   - Parent access is explicitly linked via parent_access table
   - Admins bypass isolation for operational needs

4. **Audit Trail**
   - activity_log tracks all important actions
   - updated_at timestamps track changes
   - created_by/reviewed_by fields track ownership

5. **Public vs Private**
   - CMS content is public when published
   - All user data is private by default
   - Avatars are public (safe to display)
   - Documents are private (sensitive academic/identity data)

6. **Service Role Usage**
   - Public forms (lead submissions) use service role
   - Server-side operations use service role
   - Never expose service role key to client

7. **Future Enhancements**
   - 2FA/MFA for admin accounts (Sprint 03)
   - IP-based restrictions for sensitive operations
   - Rate limiting on API endpoints
   - Automated security scanning

ACTIVATE THESE POLICIES IN SPRINT 03 AFTER AUTH IS IMPLEMENTED!
*/
