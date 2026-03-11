/**
 * Debug Auth Page
 * Temporary page to diagnose auth and redirect issues
 */

import { getCurrentUser, getUserProfile } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';

export default async function DebugAuthPage() {
  const user = await getCurrentUser();
  const profile = await getUserProfile();
  
  let studentRecord = null;
  
  if (user) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', user.id)
      .single();
    
    studentRecord = { data, error: error?.message };
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Auth Debug Information</h1>
        
        {/* Current User */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current User (auth.users)</h2>
          {user ? (
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify({
                id: user.id,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
              }, null, 2)}
            </pre>
          ) : (
            <p className="text-red-600">No authenticated user found</p>
          )}
        </div>

        {/* User Profile */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Profile (profiles table)</h2>
          {profile ? (
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(profile, null, 2)}
            </pre>
          ) : (
            <p className="text-red-600">No profile found</p>
          )}
        </div>

        {/* Student Record */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Student Record (students table)</h2>
          {studentRecord ? (
            <div>
              {studentRecord.data ? (
                <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
                  {JSON.stringify(studentRecord.data, null, 2)}
                </pre>
              ) : (
                <div>
                  <p className="text-orange-600 mb-2">No student record found</p>
                  <p className="text-sm text-gray-600">Error: {studentRecord.error || 'Not found'}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    This is likely why the dashboard redirect is failing.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">User not logged in - cannot check student record</p>
          )}
        </div>

        {/* Diagnosis */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Diagnosis</h2>
          <div className="space-y-2 text-sm">
            {!user && (
              <p className="text-red-600">❌ Not logged in - please sign in first</p>
            )}
            {user && !profile && (
              <p className="text-red-600">❌ User exists but no profile - database trigger may have failed</p>
            )}
            {user && profile && profile.role === 'student' && !studentRecord?.data && (
              <p className="text-orange-600">⚠️ Profile exists with role=student but no student record - auto-create should fix this</p>
            )}
            {user && profile && profile.role !== 'student' && (
              <p className="text-blue-600">ℹ️ User role is {profile.role} - should redirect to /{profile.role === 'admin' ? 'admin' : profile.role === 'parent' ? 'overview' : 'login'}</p>
            )}
            {user && profile && profile.role === 'student' && studentRecord?.data && (
              <p className="text-green-600">✅ Everything looks good - dashboard should work</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-2">
            <a href="/dashboard" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Try Dashboard
            </a>
            <span className="mx-2"></span>
            <a href="/login" className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Go to Login
            </a>
            <span className="mx-2"></span>
            <a href="/api/auth/signout" className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
