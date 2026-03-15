/**
 * Convert Lead to Student API
 * Creates a student record from a lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Check if already converted
    if (lead.status === 'converted' && lead.converted_to_student_id) {
      return NextResponse.json(
        { error: 'Lead already converted', student_id: lead.converted_to_student_id },
        { status: 400 }
      );
    }

    // Step 1: Create user account (profile)
    // Use admin client for user creation
    const adminClient = createAdminClient();
    
    // Check if user already exists with this email
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === lead.email);
    
    let userId: string;
    
    if (existingUser) {
      // User already exists, use their ID
      console.log('User already exists, using existing account:', existingUser.id);
      userId = existingUser.id;
    } else {
      // Create new user
      const tempPassword = Math.random().toString(36).slice(-12) + 'Aa1!';
      
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: lead.email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: lead.full_name,
          role: 'student',
        },
      });

      if (authError || !authData.user) {
        console.error('Error creating user account:', authError);
        return NextResponse.json({ 
          error: 'Failed to create student account.' 
        }, { status: 500 });
      }

      userId = authData.user.id;
    }

    // Step 2: Create/Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: lead.email,
        full_name: lead.full_name,
        role: 'student',
        phone: lead.whatsapp || lead.phone,
        whatsapp: lead.whatsapp,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Try to clean up the auth user
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: 'Failed to create student profile' }, { status: 500 });
    }

    // Step 3: Create student record (use upsert to handle duplicates)
    const { data: student, error: studentError } = await supabase
      .from('students')
      .upsert({
        id: userId,
        city: lead.city,
        nationality: lead.nationality,
        highest_education: lead.highest_education,
        current_institution: lead.current_institution,
        gpa_average: lead.gpa_average,
        english_level: lead.english_level,
        test_status: lead.test_status,
        desired_study_level: lead.desired_study_level,
        intended_major: lead.intended_major,
        preferred_intake: lead.desired_intake,
        budget_range: lead.budget_range,
        sponsor_type: lead.sponsor_type,
        prior_visa_refusal: lead.prior_visa_refusal,
        current_stage: 'assessment',
        qualification_label: lead.qualification_label,
        stage_updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (studentError) {
      console.error('Error creating student:', studentError);
      console.error('Student data attempted:', {
        id: userId,
        city: lead.city,
        nationality: lead.nationality,
        highest_education: lead.highest_education,
      });
      return NextResponse.json({ 
        error: 'Failed to create student record',
        details: studentError.message,
        code: studentError.code 
      }, { status: 500 });
    }

    // Update lead status
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        status: 'converted',
        converted_to_student_id: student.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating lead:', updateError);
    }

    return NextResponse.json({ 
      success: true, 
      student,
      message: 'Lead successfully converted to student'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
