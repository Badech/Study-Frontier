/**
 * Appointments API
 * Create and manage appointments
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const createAppointmentSchema = z.object({
  student_id: z.string().uuid(),
  appointment_type: z.enum(['initial_consultation', 'document_review', 'visa_coaching', 'follow_up', 'other']),
  scheduled_at: z.string(), // ISO date string
  duration_minutes: z.number().min(15).max(240).default(60),
  notes: z.string().optional(),
  meeting_link: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate body
    const body = await request.json();
    const validation = createAppointmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create appointment
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        student_id: data.student_id,
        counselor_id: user.id,
        appointment_type: data.appointment_type,
        scheduled_at: data.scheduled_at,
        duration_minutes: data.duration_minutes,
        status: 'scheduled',
        notes: data.notes,
        meeting_link: data.meeting_link,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      appointment,
      message: 'Appointment created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error in appointment creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
