/**
 * Leads API Routes
 * Handles eligibility assessment form submissions and lead management
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const leadSubmissionSchema = z.object({
  // Step 1: Basic profile
  full_name: z.string().min(2, 'Name is required').max(200),
  email: z.string().email('Valid email is required'),
  whatsapp: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  nationality: z.string().default('Morocco'),
  age: z.number().int().min(16).max(100).optional(),
  preferred_destination: z.string().default('USA'),
  desired_intake: z.string().optional(),
  
  // Step 2: Academic and financial fit
  highest_education: z.string().optional(),
  current_institution: z.string().optional(),
  gpa_average: z.string().optional(),
  english_level: z.string().optional(),
  test_status: z.string().optional(),
  desired_study_level: z.string().optional(),
  intended_major: z.string().optional(),
  budget_range: z.string().optional(),
  sponsor_type: z.string().optional(),
  prior_visa_refusal: z.boolean().optional(),
  goal_statement: z.string().max(2000).optional(),
  
  // Tracking
  source: z.string().optional(),
});

// ============================================================================
// POST - Public eligibility assessment form submission
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = leadSubmissionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert lead (using authenticated client, RLS allows service role or admin)
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        ...validation.data,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Lead submission error:', error);
      return NextResponse.json(
        { error: 'Failed to submit assessment. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: lead.id }, // Only return ID, not full data
      message: 'Assessment submitted successfully. We will contact you soon!',
    }, { status: 201 });

  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET - Admin endpoint to fetch leads
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin/counselor role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'counselor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: leads, error, count } = await query;

    if (error) {
      console.error('Get leads error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leads,
      total: count,
    });

  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
