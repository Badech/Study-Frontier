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
  Task, 
  Appointment,
  Message,
  ProgressStage,
  DocumentStatusSummary,
  StudentStage
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
 */
export async function getMissingDocuments(studentId: string): Promise<Document[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('student_id', studentId)
    .in('status', ['missing', 'needs_correction'])
    .order('priority', { ascending: false })
    .order('due_date', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching missing documents:', error);
    return [];
  }

  return data || [];
}

/**
 * Get document status summary for overview
 */
export async function getDocumentStatusSummary(studentId: string): Promise<DocumentStatusSummary> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('documents')
    .select('status')
    .eq('student_id', studentId);

  if (error || !data) {
    return {
      missing: 0,
      uploaded: 0,
      underReview: 0,
      needsCorrection: 0,
      approved: 0,
    };
  }

  const summary = data.reduce((acc, doc) => {
    if (doc.status === 'missing') acc.missing++;
    else if (doc.status === 'uploaded') acc.uploaded++;
    else if (doc.status === 'under_review') acc.underReview++;
    else if (doc.status === 'needs_correction') acc.needsCorrection++;
    else if (doc.status === 'approved') acc.approved++;
    return acc;
  }, {
    missing: 0,
    uploaded: 0,
    underReview: 0,
    needsCorrection: 0,
    approved: 0,
  });

  return summary;
}

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

/**
 * Get application summary statistics
 */
export async function getApplicationsSummary(studentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('applications')
    .select('status')
    .eq('student_id', studentId);

  if (error || !data) {
    return {
      total: 0,
      inProgress: 0,
      submitted: 0,
      accepted: 0,
    };
  }

  const summary = {
    total: data.length,
    inProgress: data.filter(a => 
      ['not_started', 'in_preparation', 'ready_to_submit'].includes(a.status || '')
    ).length,
    submitted: data.filter(a => 
      ['submitted', 'waiting_for_decision'].includes(a.status || '')
    ).length,
    accepted: data.filter(a => a.status === 'accepted').length,
  };

  return summary;
}

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
