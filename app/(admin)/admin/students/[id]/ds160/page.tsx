/**
 * Admin DS-160 Review Page
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Allows admins to review and approve/reject student DS-160 submissions.
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getStudentDS160Admin, getStudentDetail } from '@/lib/data/admin';
import { DS160ReviewClient } from './ds160-review-client';

interface PageProps {
  params: { id: string };
}

export default async function AdminDS160ReviewPage({ params }: PageProps) {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/login');
  }

  // Verify user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/admin');
  }

  // Fetch student and DS-160 data
  const studentDetail = await getStudentDetail(params.id);
  if (!studentDetail) {
    redirect('/admin/students');
  }

  const ds160Data = await getStudentDS160Admin(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-2">
            <Link href="/admin" className="hover:underline">Admin</Link>
            {' / '}
            <Link href="/admin/students" className="hover:underline">Students</Link>
            {' / '}
            <Link href={`/admin/students/${params.id}`} className="hover:underline">
              {studentDetail.student.full_name}
            </Link>
            {' / '}
            <span className="text-gray-900">DS-160 Review</span>
          </nav>
          <h1 className="text-3xl font-bold">DS-160 Review</h1>
          <p className="text-gray-600 mt-1">
            Review and approve DS-160 submission for {studentDetail.student.full_name}
          </p>
        </div>

        {/* Content */}
        {!ds160Data ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-2">No DS-160 Data</h3>
            <p className="text-sm text-yellow-800">
              This student has not started their DS-160 form yet.
            </p>
          </div>
        ) : (
          <DS160ReviewClient
            ds160Data={ds160Data}
            studentId={params.id}
            studentName={studentDetail.student.full_name}
            adminId={user.id}
          />
        )}
      </div>
    </div>
  );
}
