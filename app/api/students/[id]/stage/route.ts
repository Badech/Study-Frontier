/**
 * Student Stage Update API
 * Updates student's current stage
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateStageSchema = z.object({
  current_stage: z.enum(['assessment', 'planning', 'documents', 'applications', 'visa_preparation', 'pre_departure']),
  notes: z.string().optional(),
});

export async function PATCH(
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

    // Validate request body
    const body = await request.json();
    const validation = updateStageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { current_stage, notes } = validation.data;

    // Update student stage
    const { data: student, error } = await supabase
      .from('students')
      .update({
        current_stage,
        stage_updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating student stage:', error);
      return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 });
    }

    // Create stage history record
    const { error: historyError } = await supabase
      .from('student_stage_history')
      .insert({
        student_id: id,
        stage: current_stage,
        entered_at: new Date().toISOString(),
        notes: notes || null,
        changed_by: user.id,
      });

    if (historyError) {
      console.error('Error creating stage history:', historyError);
    }

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
