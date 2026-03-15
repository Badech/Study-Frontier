/**
 * Student Notes API
 * Add and retrieve admin notes for students
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const addNoteSchema = z.object({
  note: z.string().min(1, 'Note cannot be empty').max(2000),
  category: z.enum(['general', 'academic', 'financial', 'visa', 'personal']).optional(),
});

// Get notes for a student
export async function GET(
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

    // For now, get notes from student's internal_notes field
    const { data: student, error } = await supabase
      .from('students')
      .select('internal_notes')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ notes: student.internal_notes || '' });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add a note to a student
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

    // Validate body
    const body = await request.json();
    const validation = addNoteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { note } = validation.data;

    // Get existing notes
    const { data: student } = await supabase
      .from('students')
      .select('internal_notes')
      .eq('id', id)
      .single();

    // Append new note with timestamp
    const timestamp = new Date().toISOString();
    const adminName = user.email; // Get from profile in production
    const newNote = `[${timestamp}] ${adminName}:\n${note}\n\n`;
    const updatedNotes = (student?.internal_notes || '') + newNote;

    // Update student
    const { error: updateError } = await supabase
      .from('students')
      .update({ 
        internal_notes: updatedNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error adding note:', updateError);
      return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Note added successfully',
      notes: updatedNotes
    });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
