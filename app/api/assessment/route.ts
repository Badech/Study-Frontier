/**
 * Assessment Form API Endpoint
 * PRD Section 12: Eligibility Assessment Flow
 * Saves lead data to database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assessmentFormSchema } from '@/lib/validations/assessment';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate input data
    const validationResult = assessmentFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create lead record in database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        full_name: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp,
        phone: data.whatsapp,
        city: data.city,
        nationality: data.nationality,
        age: data.age,
        preferred_destination: data.preferredDestination,
        desired_intake: data.desiredIntake,
        highest_education: data.highestEducation,
        current_institution: data.currentSchool || null,
        gpa_average: data.gpa,
        english_level: data.englishLevel,
        test_status: data.testStatus,
        desired_study_level: data.desiredStudyLevel,
        intended_major: data.intendedMajor,
        budget_range: data.budgetRange,
        sponsor_type: data.sponsorType,
        prior_visa_refusal: data.priorVisaRefusal === 'yes',
        goal_statement: data.goalStatement,
        status: 'new',
        source: 'website_assessment',
      })
      .select()
      .single();

    if (leadError) {
      console.error('Error creating lead:', leadError);
      return NextResponse.json(
        { error: 'Failed to submit assessment. Please try again.' },
        { status: 500 }
      );
    }

    // TODO: Send notification to admin (in-app for now, email in Phase 5)
    // TODO: Send confirmation to lead (email in Phase 5)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Assessment submitted successfully',
        leadId: lead.id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error in assessment submission:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Prevent caching for this endpoint
export const dynamic = 'force-dynamic';
