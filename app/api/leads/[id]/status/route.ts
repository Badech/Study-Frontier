/**
 * Lead Status Update API
 * Updates lead status and qualification label
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'not_qualified', 'converted', 'archived']),
  qualification_label: z.enum(['high_potential', 'needs_followup', 'budget_mismatch', 'not_qualified_yet', 'visa_risk_profile']).optional(),
  admin_notes: z.string().optional(),
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
    const validation = updateStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { status, qualification_label, admin_notes } = validation.data;

    // Update lead
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (qualification_label !== undefined) {
      updateData.qualification_label = qualification_label;
    }

    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
