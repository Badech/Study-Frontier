/**
 * Admin Data Layer
 * Sprint 05: Admin Dashboard
 * 
 * Functions for fetching and managing admin dashboard data:
 * - Dashboard stats and metrics
 * - Tasks needing attention
 * - Lead management
 * - Student management by stage
 * - Appointments
 * - Activity feed
 */

import { createClient } from '@/lib/supabase/server';
import type {
  Lead,
  Student,
  Task,
  Appointment,
  Document,
  DocumentWithUploads,
  DocumentUpload,
  Application,
  ApplicationWithRecommendation,
} from '@/types';

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export interface AdminDashboardStats {
  newLeads: number;
  activeStudents: number;
  pendingReviews: number;
  pendingTasks: number;
  upcomingAppointments: number;
  pendingPayments: number;
  studentsByStage: {
    assessment: number;
    planning: number;
    documents: number;
    applications: number;
    visa_preparation: number;
    pre_departure: number;
  };
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createClient();

  // Get new leads (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString())
    .eq('status', 'new');

  // Get active students
  const { count: activeStudents } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Get pending document reviews
  const { count: pendingReviews } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .in('status', ['uploaded', 'under_review']);

  // Get pending tasks
  const { count: pendingTasks } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'in_progress']);

  // Get upcoming appointments (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const { count: upcomingAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .gte('scheduled_at', new Date().toISOString())
    .lte('scheduled_at', nextWeek.toISOString())
    .in('status', ['scheduled', 'confirmed']);

  // Get pending payments
  const { count: pendingPayments } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'invoice_sent', 'overdue']);

  // Get students by stage
  const { data: studentsData } = await supabase
    .from('students')
    .select('current_stage')
    .eq('is_active', true);

  const studentsByStage = {
    assessment: 0,
    planning: 0,
    documents: 0,
    applications: 0,
    visa_preparation: 0,
    pre_departure: 0,
  };

  studentsData?.forEach((student) => {
    if (student.current_stage && student.current_stage in studentsByStage) {
      studentsByStage[student.current_stage as keyof typeof studentsByStage]++;
    }
  });

  return {
    newLeads: newLeads || 0,
    activeStudents: activeStudents || 0,
    pendingReviews: pendingReviews || 0,
    pendingTasks: pendingTasks || 0,
    upcomingAppointments: upcomingAppointments || 0,
    pendingPayments: pendingPayments || 0,
    studentsByStage,
  };
}

// ============================================================================
// TASKS NEEDING ATTENTION
// ============================================================================

export interface TaskNeedingAttention {
  id: string;
  type: 'document_review' | 'overdue_task' | 'blocked_case' | 'pending_payment' | 'appointment_soon';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  studentId: string;
  studentName: string;
  dueDate?: string;
  createdAt: string;
  linkUrl: string;
}

export async function getTasksNeedingAttention(limit = 20): Promise<TaskNeedingAttention[]> {
  const supabase = await createClient();
  const tasks: TaskNeedingAttention[] = [];

  // 1. Documents pending review
  const { data: pendingDocs } = await supabase
    .from('documents')
    .select(`
      id,
      display_name,
      status,
      created_at,
      student_id,
      students!inner(id, profiles!inner(full_name))
    `)
    .in('status', ['uploaded', 'under_review'])
    .order('created_at', { ascending: true })
    .limit(10);

  pendingDocs?.forEach((doc: any) => {
    tasks.push({
      id: doc.id,
      type: 'document_review',
      title: `Review ${doc.display_name}`,
      description: `Document uploaded by ${doc.students.profiles.full_name}`,
      priority: 'high',
      studentId: doc.student_id,
      studentName: doc.students.profiles.full_name,
      createdAt: doc.created_at,
      linkUrl: `/admin/students/${doc.student_id}#documents`,
    });
  });

  // 2. Overdue tasks
  const today = new Date().toISOString().split('T')[0];
  const { data: overdueTasks } = await supabase
    .from('tasks')
    .select(`
      id,
      title,
      description,
      priority,
      due_date,
      created_at,
      student_id,
      students!inner(id, profiles!inner(full_name))
    `)
    .in('status', ['pending', 'in_progress'])
    .lt('due_date', today)
    .order('due_date', { ascending: true })
    .limit(10);

  overdueTasks?.forEach((task: any) => {
    tasks.push({
      id: task.id,
      type: 'overdue_task',
      title: `Overdue: ${task.title}`,
      description: task.description || `Task for ${task.students.profiles.full_name}`,
      priority: task.priority === 'urgent' ? 'urgent' : 'high',
      studentId: task.student_id,
      studentName: task.students.profiles.full_name,
      dueDate: task.due_date,
      createdAt: task.created_at,
      linkUrl: `/admin/students/${task.student_id}#tasks`,
    });
  });

  // 3. Upcoming appointments (next 48 hours)
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  
  const { data: upcomingAppts } = await supabase
    .from('appointments')
    .select(`
      id,
      title,
      type,
      scheduled_at,
      student_id,
      students!inner(id, profiles!inner(full_name))
    `)
    .gte('scheduled_at', new Date().toISOString())
    .lte('scheduled_at', twoDaysFromNow.toISOString())
    .in('status', ['scheduled', 'confirmed'])
    .order('scheduled_at', { ascending: true })
    .limit(5);

  upcomingAppts?.forEach((appt: any) => {
    tasks.push({
      id: appt.id,
      type: 'appointment_soon',
      title: `Upcoming: ${appt.title}`,
      description: `${appt.type} with ${appt.students.profiles.full_name}`,
      priority: 'medium',
      studentId: appt.student_id,
      studentName: appt.students.profiles.full_name,
      dueDate: appt.scheduled_at,
      createdAt: appt.scheduled_at,
      linkUrl: `/admin/appointments`,
    });
  });

  // 4. Pending payments
  const { data: pendingPayments } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      currency,
      status,
      due_date,
      created_at,
      student_id,
      students!inner(id, profiles!inner(full_name))
    `)
    .in('status', ['pending', 'invoice_sent'])
    .order('due_date', { ascending: true, nullsFirst: false })
    .limit(10);

  pendingPayments?.forEach((payment: any) => {
    tasks.push({
      id: payment.id,
      type: 'pending_payment',
      title: `Payment: ${payment.currency} ${payment.amount}`,
      description: `${payment.status === 'pending' ? 'Needs approval' : 'Invoice sent'} - ${payment.students.profiles.full_name}`,
      priority: payment.status === 'pending' ? 'high' : 'medium',
      studentId: payment.student_id,
      studentName: payment.students.profiles.full_name,
      dueDate: payment.due_date,
      createdAt: payment.created_at,
      linkUrl: `/admin/students/${payment.student_id}#payments`,
    });
  });

  // Sort by priority and date
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return tasks.slice(0, limit);
}

// ============================================================================
// LEADS MANAGEMENT
// ============================================================================

export async function getLeads(filters?: {
  status?: string;
  qualificationLabel?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}): Promise<{ leads: Lead[]; total: number }> {
  const supabase = await createClient();
  
  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' });

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.qualificationLabel) {
    query = query.eq('qualification_label', filters.qualificationLabel);
  }

  if (filters?.searchQuery) {
    query = query.or(`full_name.ilike.%${filters.searchQuery}%,email.ilike.%${filters.searchQuery}%`);
  }

  // Pagination
  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;
  
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching leads:', error);
    return { leads: [], total: 0 };
  }

  return {
    leads: data || [],
    total: count || 0,
  };
}

export async function updateLeadStatus(
  leadId: string,
  updates: {
    status?: string;
    qualificationLabel?: string;
    internalNotes?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const updateData: any = {};
  
  if (updates.status) updateData.status = updates.status;
  if (updates.qualificationLabel !== undefined) {
    updateData.qualification_label = updates.qualificationLabel;
  }
  if (updates.internalNotes !== undefined) {
    updateData.internal_notes = updates.internalNotes;
  }

  const { error } = await supabase
    .from('leads')
    .update(updateData)
    .eq('id', leadId);

  if (error) {
    console.error('Error updating lead:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================================================
// STUDENTS MANAGEMENT
// ============================================================================

export interface StudentWithProfile {
  id: string;
  full_name: string;
  email: string;
  current_stage: string;
  stage_updated_at: string;
  qualification_label: string | null;
  is_active: boolean;
  created_at: string;
  city: string | null;
  desired_study_level: string | null;
  intended_major: string | null;
  preferred_intake: string | null;
}

export async function getStudentsByStage(
  stage?: string,
  filters?: {
    searchQuery?: string;
    qualificationLabel?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ students: StudentWithProfile[]; total: number }> {
  const supabase = await createClient();

  let query = supabase
    .from('students')
    .select(`
      id,
      current_stage,
      stage_updated_at,
      qualification_label,
      is_active,
      created_at,
      city,
      desired_study_level,
      intended_major,
      preferred_intake,
      profiles!inner(full_name, email)
    `, { count: 'exact' })
    .eq('is_active', true);

  if (stage) {
    query = query.eq('current_stage', stage);
  }

  if (filters?.qualificationLabel) {
    query = query.eq('qualification_label', filters.qualificationLabel);
  }

  if (filters?.searchQuery) {
    query = query.or(`profiles.full_name.ilike.%${filters.searchQuery}%,profiles.email.ilike.%${filters.searchQuery}%`);
  }

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  const { data, error, count } = await query
    .order('stage_updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching students:', error);
    return { students: [], total: 0 };
  }

  // Transform data to flatten profiles
  const students: StudentWithProfile[] = (data || []).map((student: any) => ({
    id: student.id,
    full_name: student.profiles.full_name,
    email: student.profiles.email,
    current_stage: student.current_stage,
    stage_updated_at: student.stage_updated_at,
    qualification_label: student.qualification_label,
    is_active: student.is_active,
    created_at: student.created_at,
    city: student.city,
    desired_study_level: student.desired_study_level,
    intended_major: student.intended_major,
    preferred_intake: student.preferred_intake,
  }));

  return {
    students,
    total: count || 0,
  };
}

export async function getStudentById(studentId: string) {
  return getStudentDetail(studentId);
}

export async function getStudentDetail(studentId: string) {
  const supabase = await createClient();

  // Get student profile
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .select(`
      *,
      profile:profiles!inner(*)
    `)
    .eq('id', studentId)
    .single();

  if (studentError || !studentData) {
    return null;
  }

  const student = {
    ...studentData,
    profile: Array.isArray(studentData.profile) ? studentData.profile[0] : studentData.profile
  };

  // Get documents summary
  const { data: documents } = await supabase
    .from('documents')
    .select('status')
    .eq('student_id', studentId);

  const documentsSummary = {
    total: documents?.length || 0,
    missing: documents?.filter(d => d.status === 'missing').length || 0,
    uploaded: documents?.filter(d => d.status === 'uploaded').length || 0,
    under_review: documents?.filter(d => d.status === 'under_review').length || 0,
    needs_correction: documents?.filter(d => d.status === 'needs_correction').length || 0,
    approved: documents?.filter(d => d.status === 'approved').length || 0,
  };

  // Get applications summary
  const { data: applications } = await supabase
    .from('applications')
    .select('status')
    .eq('student_id', studentId);

  const applicationsSummary = {
    total: applications?.length || 0,
    in_preparation: applications?.filter(a => a.status === 'in_preparation').length || 0,
    submitted: applications?.filter(a => a.status === 'submitted').length || 0,
    accepted: applications?.filter(a => a.status === 'accepted').length || 0,
    rejected: applications?.filter(a => a.status === 'rejected').length || 0,
  };

  // Get pending tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('student_id', studentId)
    .in('status', ['pending', 'in_progress'])
    .order('due_date', { ascending: true })
    .limit(5);

  // Get upcoming appointments
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('student_id', studentId)
    .gte('scheduled_at', new Date().toISOString())
    .in('status', ['scheduled', 'confirmed'])
    .order('scheduled_at', { ascending: true })
    .limit(3);

  return {
    student: {
      ...student,
      full_name: student.profiles.full_name,
      email: student.profiles.email,
      phone: student.profiles.phone,
      whatsapp: student.profiles.whatsapp,
    },
    documentsSummary,
    applicationsSummary,
    tasks: tasks || [],
    appointments: appointments || [],
  };
}

// ============================================================================
// APPOINTMENTS MANAGEMENT
// ============================================================================

export async function getAdminAppointments(filters?: {
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}): Promise<{ appointments: any[]; total: number }> {
  const supabase = await createClient();

  let query = supabase
    .from('appointments')
    .select(`
      *,
      students!inner(id, profiles!inner(full_name, email))
    `, { count: 'exact' });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.dateFrom) {
    query = query.gte('scheduled_at', filters.dateFrom);
  }

  if (filters?.dateTo) {
    query = query.lte('scheduled_at', filters.dateTo);
  }

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  const { data, error, count } = await query
    .order('scheduled_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching appointments:', error);
    return { appointments: [], total: 0 };
  }

  // Transform data
  const appointments = (data || []).map((appt: any) => ({
    ...appt,
    student_name: appt.students.profiles.full_name,
    student_email: appt.students.profiles.email,
  }));

  return {
    appointments,
    total: count || 0,
  };
}

// ============================================================================
// ACTIVITY FEED
// ============================================================================

export interface ActivityItem {
  id: string;
  type: 'document' | 'stage_change' | 'application' | 'appointment' | 'payment' | 'task';
  title: string;
  description: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  icon?: string;
}

export async function getRecentActivity(limit = 20): Promise<ActivityItem[]> {
  const supabase = await createClient();
  const activities: ActivityItem[] = [];

  // Get recent document uploads
  const { data: recentDocs } = await supabase
    .from('documents')
    .select(`
      id,
      display_name,
      status,
      updated_at,
      student_id,
      students!inner(profiles!inner(full_name))
    `)
    .in('status', ['uploaded', 'approved', 'needs_correction'])
    .order('updated_at', { ascending: false })
    .limit(10);

  recentDocs?.forEach((doc: any) => {
    let description = '';
    if (doc.status === 'uploaded') description = 'Document uploaded';
    else if (doc.status === 'approved') description = 'Document approved';
    else if (doc.status === 'needs_correction') description = 'Document needs correction';

    activities.push({
      id: doc.id,
      type: 'document',
      title: doc.display_name,
      description,
      studentId: doc.student_id,
      studentName: doc.students.profiles.full_name,
      timestamp: doc.updated_at,
    });
  });

  // Get recent stage changes
  const { data: recentStageChanges } = await supabase
    .from('students')
    .select(`
      id,
      current_stage,
      stage_updated_at,
      profiles!inner(full_name)
    `)
    .order('stage_updated_at', { ascending: false })
    .limit(10);

  recentStageChanges?.forEach((student: any) => {
    activities.push({
      id: student.id,
      type: 'stage_change',
      title: `Stage: ${student.current_stage}`,
      description: `Moved to ${student.current_stage.replace('_', ' ')}`,
      studentId: student.id,
      studentName: student.profiles.full_name,
      timestamp: student.stage_updated_at,
    });
  });

  // Sort by timestamp
  activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return activities.slice(0, limit);
}

// ============================================================================
// DOCUMENT MANAGEMENT - Sprint 06
// ============================================================================

/**
 * Get all documents for a specific student (admin view)
 */
export async function getStudentDocumentsAdmin(studentId: string): Promise<DocumentWithUploads[]> {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      *,
      uploads:document_uploads(*),
      reviewed_by_profile:profiles!documents_reviewed_by_fkey(full_name, email)
    `)
    .eq('student_id', studentId)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching student documents (admin):', error);
    return [];
  }

  return (documents || []).map(doc => ({
    ...doc,
    uploads: (doc.uploads || []).sort((a: DocumentUpload, b: DocumentUpload) => 
      b.version - a.version
    )
  }));
}

/**
 * Get documents that need admin review across all students
 */
export async function getDocumentsPendingReview(limit: number = 50): Promise<DocumentWithUploads[]> {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      *,
      uploads:document_uploads(*),
      student:students!inner(*)
    `)
    .in('status', ['uploaded', 'under_review'])
    .order('updated_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching documents pending review:', error);
    return [];
  }

  return (documents || []).map(doc => ({
    ...doc,
    uploads: (doc.uploads || []).filter((upload: DocumentUpload) => upload.is_current)
  }));
}

/**
 * Get document summary for a student (admin view)
 */
export async function getStudentDocumentSummary(studentId: string) {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from('documents')
    .select('status, is_required')
    .eq('student_id', studentId);

  if (error || !documents) {
    console.error('Error fetching document summary:', error);
    return {
      total: 0,
      approved: 0,
      under_review: 0,
      missing: 0,
      needs_correction: 0,
    };
  }

  return {
    total: documents.length,
    approved: documents.filter(d => d.status === 'approved').length,
    under_review: documents.filter(d => d.status === 'under_review').length,
    missing: documents.filter(d => d.status === 'missing' && d.is_required).length,
    needs_correction: documents.filter(d => d.status === 'needs_correction').length,
  };
}

// ============================================================================
// APPLICATION MANAGEMENT - Sprint 06
// ============================================================================

/**
 * Get all applications for a specific student (admin view)
 */
export async function getStudentApplicationsAdmin(studentId: string): Promise<ApplicationWithRecommendation[]> {
  const supabase = await createClient();

  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      *,
      recommendation:school_recommendations(*),
      created_by_profile:profiles!applications_created_by_fkey(full_name, email)
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching student applications (admin):', error);
    return [];
  }

  return (applications || []).map(app => ({
    ...app,
    recommendation: app.recommendation || null
  }));
}

/**
 * Get application summary for a student (admin view)
 */
export async function getStudentApplicationSummary(studentId: string) {
  const supabase = await createClient();

  const { data: applications, error } = await supabase
    .from('applications')
    .select('status')
    .eq('student_id', studentId);

  if (error || !applications) {
    console.error('Error fetching application summary:', error);
    return {
      total: 0,
      in_preparation: 0,
      submitted: 0,
      accepted: 0,
      rejected: 0,
    };
  }

  return {
    total: applications.length,
    in_preparation: applications.filter(a => 
      ['not_started', 'in_preparation', 'ready_to_submit'].includes(a.status)
    ).length,
    submitted: applications.filter(a => 
      ['submitted', 'waiting_for_decision'].includes(a.status)
    ).length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };
}

/**
 * Get all school recommendations for a student
 */
export async function getStudentSchoolRecommendations(studentId: string) {
  const supabase = await createClient();

  const { data: recommendations, error } = await supabase
    .from('school_recommendations')
    .select(`
      *,
      recommended_by_profile:profiles!school_recommendations_recommended_by_fkey(full_name, email)
    `)
    .eq('student_id', studentId)
    .eq('is_active', true)
    .order('priority_rank', { ascending: true });

  if (error) {
    console.error('Error fetching school recommendations:', error);
    return [];
  }

  return recommendations || [];
}

// ============================================================================
// DS-160 AND VISA PREPARATION - Sprint 07
// ============================================================================

/**
 * Get DS-160 submissions pending admin review
 */
export async function getDS160PendingReview(limit: number = 50) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ds160_data')
    .select(`
      *,
      student:students!inner(
        *,
        profile:profiles!inner(*)
      )
    `)
    .eq('status', 'submitted_for_review')
    .order('updated_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching DS-160 pending review:', error);
    return [];
  }

  return data || [];
}

/**
 * Get DS-160 data for a specific student (admin view)
 */
export async function getStudentDS160Admin(studentId: string) {
  const supabase = await createClient();

  const { data: ds160, error } = await supabase
    .from('ds160_data')
    .select(`
      *,
      reviewed_by_profile:profiles!ds160_data_reviewed_by_fkey(full_name, email)
    `)
    .eq('student_id', studentId)
    .single();

  if (error || !ds160) {
    return null;
  }

  return ds160;
}

/**
 * Get visa preparation data for a specific student (admin view)
 */
export async function getStudentVisaPreparationAdmin(studentId: string) {
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
 * Get students in visa preparation stage
 */
export async function getStudentsInVisaPreparation(limit: number = 50) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      profile:profiles!inner(*),
      visa_prep:visa_preparation(*)
    `)
    .eq('current_stage', 'visa_preparation')
    .eq('is_active', true)
    .order('stage_updated_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching students in visa preparation:', error);
    return [];
  }

  return data || [];
}
