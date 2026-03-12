/**
 * Student DS-160 Form Page
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Main page for students to complete their DS-160 form.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getStudentDS160 } from '@/lib/data/student';
import { DS160FormClient } from './ds160-form-client';


export const dynamic = 'force-dynamic';

export default async function StudentDS160Page() {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/login');
  }

  // Verify user is a student
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'student') {
    redirect('/dashboard');
  }

  // Fetch DS-160 data
  const ds160Data = await getStudentDS160(user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <DS160FormClient 
        initialData={ds160Data.form_data} 
        studentId={user.id}
        ds160Id={ds160Data.id}
        currentStatus={ds160Data.status}
        completionPercentage={ds160Data.completion_percentage}
        sectionsCompleted={ds160Data.sections_completed || []}
        reviewNotes={ds160Data.review_notes}
      />
    </div>
  );
}
