/**
 * Student Data Utilities
 * Sprint 04: Server-side data fetching for student dashboard
 * 
 * All functions are async and designed for server components.
 * They fetch data from Supabase and return typed results.
 */

import { createClient } from '@/lib/supabase/server';
import type { 
  StudentDashboardData, 
  Document, 
  DocumentUpload,
  DocumentWithUploads,
  Task, 
  Appointment,
  Message,
  ProgressStage,
  DocumentStatusSummary,
  StudentStage,
  Application,
  ApplicationWithRecommendation
} from '@/types';

/**
 * Get complete student profile including profiles + students join
 */
export async function getStudentProfile(userId: string) {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('*')
    .eq('id', userId)
    .single();

  if (studentError || !student) {
    console.error('Error fetching student record:', studentError);
    
    // If student record doesn't exist, create a default one
    if (studentError?.code === 'PGRST116') { // Not found error
      console.log('Creating default student record for user:', userId);
      
      const { data: newStudent, error: createError } = await supabase
        .from('students')
        .insert({
          id: userId,
          current_stage: 'assessment',
          is_active: true,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating student record:', createError);
        return null;
      }

      return { profile, student: newStudent };
    }
    
    return null;
  }

  return { profile, student };
}

/**
 * Get active tasks for student, sorted by priority and due date
 */
export async function getStudentTasks(studentId: string): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('student_id', studentId)
    .in('status', ['pending', 'in_progress'])
    .eq('visible_to_student', true)
    .order('priority', { ascending: false })
    .order('due_date', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching student tasks:', error);
    return [];
  }

  return data || [];
}

/**
 * Get the next action (highest priority task) for student
 */
export async function getNextAction(studentId: string): Promise<Task | null> {
  const tasks = await getStudentTasks(studentId);
  return tasks[0] || null;
}

/**
 * Get documents that need student attention (missing or needs correction)
 * Only returns documents that are required and not yet approved
 */
export async function getMissingDocuments(studentId: string): Promise<Document[]> {
  const supabase = await createClient();

  // Fetch all document requirements for this student
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('student_id', studentId)
    .in('status', ['missing', 'needs_correction'])
    .eq('is_required', true)
    .order('priority', { ascending: false })
    .order('due_date', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching missing documents:', error);
    return [];
  }

  console.log(`getMissingDocuments for student ${studentId}:`, {
    totalDocuments: data?.length || 0,
    documents: data?.map(d => ({ type: d.document_type, status: d.status, required: d.is_required }))
  });

  // Filter to ensure we only return documents that actually need action
  const missingDocs = (data || []).filter(doc => {
    // Show if status is needs_correction (always needs attention)
    if (doc.status === 'needs_correction') return true;
    
    // Show if status is missing and it's a required document
    if (doc.status === 'missing' && doc.is_required) return true;
    
    // Don't show if already uploaded, under review, or approved
    return false;
  });

  console.log(`After filtering: ${missingDocs.length} documents need attention`);

  return missingDocs;
}

// Document status summary moved to Sprint 06 section below

/**
 * Get upcoming appointments for student
 */
export async function getUpcomingAppointments(studentId: string, limit = 3): Promise<Appointment[]> {
  const supabase = await createClient();

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('student_id', studentId)
    .in('status', ['scheduled', 'confirmed'])
    .gte('scheduled_at', now)
    .order('scheduled_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }

  return data || [];
}

/**
 * Get recent messages for student
 */
export async function getRecentMessages(studentId: string, limit = 5): Promise<Message[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}

// Application summary moved to Sprint 06 section below

/**
 * Get progress stages with current stage highlighted
 */
export function getProgressStages(currentStage: StudentStage): ProgressStage[] {
  const stages: Array<{ key: StudentStage; label: string; description: string; order: number }> = [
    { 
      key: 'assessment', 
      label: 'Assessment', 
      description: 'Initial evaluation and planning',
      order: 1 
    },
    { 
      key: 'planning', 
      label: 'Planning', 
      description: 'Strategy and school selection',
      order: 2 
    },
    { 
      key: 'documents', 
      label: 'Documents', 
      description: 'Gather required documents',
      order: 3 
    },
    { 
      key: 'applications', 
      label: 'Applications', 
      description: 'Submit school applications',
      order: 4 
    },
    { 
      key: 'visa_preparation', 
      label: 'Visa Preparation', 
      description: 'Prepare for visa interview',
      order: 5 
    },
    { 
      key: 'pre_departure', 
      label: 'Pre-Departure', 
      description: 'Final preparations',
      order: 6 
    },
  ];

  const currentOrder = stages.find(s => s.key === currentStage)?.order || 1;

  return stages.map(stage => ({
    ...stage,
    isComplete: stage.order < currentOrder,
    isCurrent: stage.key === currentStage,
  }));
}

/**
 * Get all dashboard data in a single call (optimized for server components)
 */
export async function getStudentDashboardData(userId: string): Promise<StudentDashboardData | null> {
  const profileData = await getStudentProfile(userId);
  
  if (!profileData) {
    return null;
  }

  const { profile, student } = profileData;

  // Fetch all data in parallel for performance
  const [
    nextAction,
    tasks,
    missingDocuments,
    upcomingAppointments,
    recentMessages,
    applicationsSummary,
  ] = await Promise.all([
    getNextAction(student.id),
    getStudentTasks(student.id),
    getMissingDocuments(student.id),
    getUpcomingAppointments(student.id),
    getRecentMessages(student.id),
    getApplicationsSummary(student.id),
  ]);

  return {
    profile,
    student,
    nextAction,
    tasks,
    missingDocuments,
    upcomingAppointments,
    recentMessages,
    applicationsSummary,
  };
}

// ============================================================================
// DOCUMENT MANAGEMENT - Sprint 06
// ============================================================================

/**
 * Get all documents for a student with their uploads
 */
export async function getStudentDocuments(studentId: string): Promise<DocumentWithUploads[]> {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      *,
      uploads:document_uploads(*)
    `)
    .eq('student_id', studentId)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching student documents:', error);
    return [];
  }

  // Transform the data to match DocumentWithUploads type
  return (documents || []).map(doc => ({
    ...doc,
    uploads: (doc.uploads || []).filter((upload: DocumentUpload) => upload.is_current)
  }));
}

/**
 * Get a single document with all its uploads (including history)
 */
export async function getDocumentWithHistory(documentId: string): Promise<DocumentWithUploads | null> {
  const supabase = await createClient();

  const { data: document, error } = await supabase
    .from('documents')
    .select(`
      *,
      uploads:document_uploads(*),
      reviewed_by_profile:profiles!documents_reviewed_by_fkey(full_name, email)
    `)
    .eq('id', documentId)
    .single();

  if (error || !document) {
    console.error('Error fetching document:', error);
    return null;
  }

  return {
    ...document,
    uploads: (document.uploads || []).sort((a: DocumentUpload, b: DocumentUpload) => 
      b.version - a.version
    )
  };
}

/**
 * Get document status summary for a student
 */
export async function getDocumentStatusSummary(studentId: string): Promise<DocumentStatusSummary> {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from('documents')
    .select('status')
    .eq('student_id', studentId);

  if (error || !documents) {
    console.error('Error fetching document statuses:', error);
    return {
      missing: 0,
      uploaded: 0,
      underReview: 0,
      needsCorrection: 0,
      approved: 0,
    };
  }

  const summary: DocumentStatusSummary = {
    missing: 0,
    uploaded: 0,
    underReview: 0,
    needsCorrection: 0,
    approved: 0,
  };

  documents.forEach(doc => {
    switch (doc.status) {
      case 'missing':
        summary.missing++;
        break;
      case 'uploaded':
        summary.uploaded++;
        break;
      case 'under_review':
        summary.underReview++;
        break;
      case 'needs_correction':
        summary.needsCorrection++;
        break;
      case 'approved':
        summary.approved++;
        break;
    }
  });

  return summary;
}

// ============================================================================
// APPLICATION MANAGEMENT - Sprint 06
// ============================================================================

/**
 * Get all applications for a student
 */
export async function getStudentApplications(studentId: string): Promise<ApplicationWithRecommendation[]> {
  const supabase = await createClient();

  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      *,
      recommendation:school_recommendations(*)
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching student applications:', error);
    return [];
  }

  return (applications || []).map(app => ({
    ...app,
    recommendation: app.recommendation || null
  }));
}

/**
 * Get a single application by ID
 */
export async function getApplication(applicationId: string): Promise<Application | null> {
  const supabase = await createClient();

  const { data: application, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .single();

  if (error || !application) {
    console.error('Error fetching application:', error);
    return null;
  }

  return application;
}

/**
 * Get application summary statistics for a student
 */
export async function getApplicationsSummary(studentId: string) {
  const supabase = await createClient();

  const { data: applications, error } = await supabase
    .from('applications')
    .select('status')
    .eq('student_id', studentId);

  if (error || !applications) {
    console.error('Error fetching applications:', error);
    return {
      total: 0,
      inProgress: 0,
      submitted: 0,
      accepted: 0,
    };
  }

  return {
    total: applications.length,
    inProgress: applications.filter(a => 
      ['not_started', 'in_preparation', 'ready_to_submit'].includes(a.status)
    ).length,
    submitted: applications.filter(a => 
      ['submitted', 'waiting_for_decision'].includes(a.status)
    ).length,
    accepted: applications.filter(a => a.status === 'accepted').length,
  };
}

// ============================================================================
// DS-160 AND VISA PREPARATION - Sprint 07
// ============================================================================

/**
 * Get DS-160 data for a student
 */
export async function getStudentDS160(studentId: string) {
  const supabase = await createClient();

  const { data: ds160, error } = await supabase
    .from('ds160_data')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error || !ds160) {
    // Return empty structure if no DS-160 exists yet
    return {
      id: null,
      student_id: studentId,
      form_data: {},
      status: 'draft',
      sections_completed: [],
      completion_percentage: 0,
      reviewed_by: null,
      reviewed_at: null,
      review_notes: null,
      created_at: null,
      updated_at: null,
    };
  }

  return ds160;
}

/**
 * Get visa preparation data for a student
 */
export async function getStudentVisaPreparation(studentId: string) {
  const supabase = await createClient();

  const { data: visaPrep, error } = await supabase
    .from('visa_preparation')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error || !visaPrep) {
    // Return empty structure if no visa prep exists yet
    return {
      id: null,
      student_id: studentId,
      mock_interview_status: 'not_scheduled',
      last_mock_interview_date: null,
      mock_interview_notes: null,
      checklist_items: [],
      readiness_level: 'not_ready',
      interview_date: null,
      interview_location: null,
      admin_notes: null,
      created_at: null,
      updated_at: null,
    };
  }

  return visaPrep;
}

/**
 * Get visa-related appointments for a student
 */
export async function getVisaAppointments(studentId: string): Promise<Appointment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('student_id', studentId)
    .in('type', ['visa_coaching', 'mock_interview'])
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('Error fetching visa appointments:', error);
    return [];
  }

  return data || [];
}
