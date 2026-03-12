/**
 * Student Visa Preparation Page
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Shows visa readiness, checklist, mock interview status, and coaching booking.
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getStudentVisaPreparation, getVisaAppointments, getStudentDS160 } from '@/lib/data/student';
import { VisaPreparationClient } from './visa-prep-client';


export const dynamic = 'force-dynamic';

export default async function VisaPreparationPage() {
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

  // Fetch data
  const [visaPrep, visaAppointments, ds160Data] = await Promise.all([
    getStudentVisaPreparation(user.id),
    getVisaAppointments(user.id),
    getStudentDS160(user.id),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Visa Preparation</h1>
          <p className="text-gray-600">
            Track your visa interview preparation and readiness
          </p>
        </div>

        {/* DS-160 status banner */}
        <div className="mb-6">
          {ds160Data.status === 'draft' || !ds160Data.id ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ DS-160 Not Completed</h3>
              <p className="text-sm text-yellow-800 mb-3">
                You need to complete and submit your DS-160 form before scheduling your visa interview.
              </p>
              <Link
                href="/dashboard/visa/ds160"
                className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
              >
                Complete DS-160 Form
              </Link>
            </div>
          ) : ds160Data.status === 'approved' || ds160Data.status === 'ready_for_submission' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ DS-160 Approved</h3>
              <p className="text-sm text-green-800">
                Your DS-160 has been approved. You can now proceed with visa interview preparation.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">DS-160 Status: {ds160Data.status}</h3>
              <p className="text-sm text-blue-800">
                Your DS-160 is currently being reviewed. You can start preparing for your visa interview.
              </p>
            </div>
          )}
        </div>

        {/* Main content */}
        <VisaPreparationClient
          visaPrep={visaPrep}
          appointments={visaAppointments}
          studentId={user.id}
        />
      </div>
    </div>
  );
}
