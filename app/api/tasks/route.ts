/**
 * Tasks API
 * Create and manage tasks
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const createTaskSchema = z.object({
  student_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.enum(['document', 'application', 'visa', 'payment', 'general']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.string().optional(), // ISO date string
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
    console.log('Task creation request body:', body);
    
    const validation = createTaskSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation failed:', validation.error.format());
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create task
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        student_id: data.student_id,
        assigned_to: user.id,
        assigned_by: user.id,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        due_date: data.due_date,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      task,
      message: 'Task created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error in task creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
