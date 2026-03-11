/**
 * Admin Visa Preparation Management Page
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Allows admins to manage student visa preparation, mock interviews, and readiness.
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getStudentVisaPreparationAdmin, getStudentDetail } from '@/lib/data/admin';
import { VisaPrepManagementClient } from './visa-prep-management-client';

interface PageProps {
  params: { id: string };
}

export default async function AdminVisaPrepPage({ params }: PageProps) {
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

  // Fetch student and visa prep data
  const studentDetail = await getStudentDetail(params.id);
  if (!studentDetail) {
    redirect('/admin/students');
  }

  const visaPrepData = await getStudentVisaPreparationAdmin(params.id);

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
            <span className="text-gray-900">Visa Preparation</span>
          </nav>
          <h1 className="text-3xl font-bold">Visa Preparation Management</h1>
          <p className="text-gray-600 mt-1">
            Manage visa readiness and mock interviews for {studentDetail.student.full_name}
          </p>
        </div>

        {/* Content */}
        <VisaPrepManagementClient
          visaPrepData={visaPrepData}
          studentId={params.id}
          studentName={studentDetail.student.full_name}
          adminId={user.id}
        />
      </div>
    </div>
  );
}
