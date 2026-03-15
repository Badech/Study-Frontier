-- Fix: Allow students to update and insert their own documents
-- This fixes the issue where uploaded documents remain in 'missing' status
-- because students couldn't update the document status due to RLS restrictions

-- Add policy for students to update their own documents
CREATE POLICY "Students can update own document status"
ON documents
FOR UPDATE
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Add policy for students to insert their own document records
CREATE POLICY "Students can create own documents"
ON documents
FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());
