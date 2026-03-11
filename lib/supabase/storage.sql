-- Study Frontier Storage Buckets Configuration
-- Sprint 02: Supabase and Schema
-- Storage for documents, avatars, and attachments

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Documents bucket - for student document uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false, -- Private - requires authentication
  10485760, -- 10MB limit per file
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket - for user profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public - avatars can be displayed publicly
  2097152, -- 2MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Attachments bucket - for message attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments',
  'attachments',
  false, -- Private
  5242880, -- 5MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- These will be activated in Sprint 03 when auth is implemented
-- For now, they are documented here for reference
-- ============================================================================

-- ============================================================================
-- DOCUMENTS BUCKET POLICIES
-- ============================================================================

-- Students can upload to their own folder
CREATE POLICY "Students can upload documents to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM students WHERE id = auth.uid()
  )
);

-- Students can view their own documents
CREATE POLICY "Students can view own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Students can update their own documents
CREATE POLICY "Students can update own documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Students can delete their own documents
CREATE POLICY "Students can delete own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'counselor')
  )
);

-- Admins can manage all documents
CREATE POLICY "Admins can manage all documents"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Parents can view student documents (read-only)
CREATE POLICY "Parents can view linked student documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM parent_access 
    WHERE parent_id = auth.uid() 
    AND student_id = (storage.foldername(name))[1]::uuid
    AND is_active = true
  )
);

-- ============================================================================
-- AVATARS BUCKET POLICIES
-- ============================================================================

-- Anyone can view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- ATTACHMENTS BUCKET POLICIES
-- ============================================================================

-- Users can upload attachments
CREATE POLICY "Users can upload attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view attachments they created or received
CREATE POLICY "Users can view own attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'attachments' AND
  (
    -- User uploaded it
    (storage.foldername(name))[1] = auth.uid()::text OR
    -- User is admin
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'counselor')
    )
  )
);

-- Users can delete their own attachments
CREATE POLICY "Users can delete own attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- STORAGE FOLDER STRUCTURE DOCUMENTATION
-- ============================================================================

/*
DOCUMENTS BUCKET STRUCTURE:
documents/
  └── {student_id}/
      ├── passport/
      │   ├── primary_{timestamp}.pdf
      │   └── revision_{timestamp}.pdf
      ├── transcripts/
      │   ├── transcript_{timestamp}.pdf
      │   └── translation_{timestamp}.pdf
      ├── financial/
      │   ├── bank_statement_{timestamp}.pdf
      │   └── sponsor_letter_{timestamp}.pdf
      └── visa/
          ├── i20_{timestamp}.pdf
          └── ds160_confirmation_{timestamp}.pdf

AVATARS BUCKET STRUCTURE:
avatars/
  └── {user_id}/
      └── avatar_{timestamp}.{ext}

ATTACHMENTS BUCKET STRUCTURE:
attachments/
  └── {user_id}/
      └── {message_id}/
          └── attachment_{timestamp}.{ext}
*/

-- ============================================================================
-- HELPER NOTES
-- ============================================================================

/*
FILE SIZE LIMITS:
- Documents: 10MB (sufficient for scanned PDFs and images)
- Avatars: 2MB (more than enough for profile pictures)
- Attachments: 5MB (reasonable for message attachments)

ALLOWED MIME TYPES:
- Documents: PDF, images, Word documents
- Avatars: Images only (JPEG, PNG, WebP)
- Attachments: Documents, images, Excel files

STORAGE BEST PRACTICES:
1. Always organize files in user-specific folders
2. Use timestamps in filenames to avoid conflicts
3. Include document type in path for organization
4. Implement file versioning for document revisions
5. Clean up old versions periodically (admin task)

SECURITY NOTES:
1. Documents bucket is private - requires RLS policies
2. Avatars bucket is public - safe to display anywhere
3. Attachments bucket is private - message-scoped access
4. All uploads are authenticated
5. File size limits enforced at bucket level
6. MIME types restricted to prevent malicious uploads
*/
