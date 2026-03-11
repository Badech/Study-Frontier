/**
 * DS-160 Form Validation Schemas
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Validation schemas for DS-160 visa form sections.
 * These allow partial validation (draft state) and full validation (submission).
 */

import { z } from 'zod';

// ============================================================================
// SECTION 1: PERSONAL INFORMATION
// ============================================================================

export const ds160PersonalSchema = z.object({
  // Full name
  surname: z.string().min(1, 'Surname is required').optional(),
  given_name: z.string().min(1, 'Given name is required').optional(),
  full_name_native: z.string().optional(),
  
  // Other names
  have_other_names: z.boolean().optional(),
  other_surnames: z.string().optional(),
  other_given_names: z.string().optional(),
  
  // Gender and marital status
  gender: z.enum(['male', 'female']).optional(),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed', 'separated', 'other']).optional(),
  
  // Birth information
  date_of_birth: z.string().optional(), // YYYY-MM-DD
  city_of_birth: z.string().optional(),
  state_of_birth: z.string().optional(),
  country_of_birth: z.string().optional(),
  
  // Nationality and identification
  nationality: z.string().optional(),
  have_other_nationality: z.boolean().optional(),
  other_nationality: z.string().optional(),
  
  national_id_number: z.string().optional(),
  us_social_security_number: z.string().optional(),
  us_taxpayer_id: z.string().optional(),
});

// ============================================================================
// SECTION 2: TRAVEL INFORMATION
// ============================================================================

export const ds160TravelSchema = z.object({
  // Purpose of trip
  purpose_of_trip: z.enum(['B1/B2', 'F1', 'F2', 'J1', 'J2', 'M1', 'other']).optional(),
  purpose_of_trip_other: z.string().optional(),
  
  // Intended travel dates
  intended_arrival_date: z.string().optional(),
  intended_length_of_stay: z.string().optional(), // e.g., "4 years", "2 months"
  
  // Travel details
  intended_address_in_us: z.string().optional(),
  intended_city: z.string().optional(),
  intended_state: z.string().optional(),
  
  // Travel companions
  traveling_with_others: z.boolean().optional(),
  travel_companions: z.string().optional(),
  
  // Previous US visits
  have_been_to_us_before: z.boolean().optional(),
  previous_visit_date: z.string().optional(),
  previous_visit_length: z.string().optional(),
  
  // Previous visa
  have_us_visa: z.boolean().optional(),
  visa_number: z.string().optional(),
  visa_issue_date: z.string().optional(),
  visa_type: z.string().optional(),
  is_same_type_visa: z.boolean().optional(),
  is_same_country_visa: z.boolean().optional(),
  have_ten_fingerprints: z.boolean().optional(),
  have_visa_lost_stolen: z.boolean().optional(),
  
  // Visa denial
  have_been_refused_visa: z.boolean().optional(),
  visa_refusal_explanation: z.string().optional(),
  
  // Petition
  has_petition_filed: z.boolean().optional(),
  petition_filed_by: z.string().optional(),
});

// ============================================================================
// SECTION 3: ADDRESS AND PHONE
// ============================================================================

export const ds160AddressSchema = z.object({
  // Current address
  home_address_street: z.string().optional(),
  home_address_line2: z.string().optional(),
  home_address_city: z.string().optional(),
  home_address_state: z.string().optional(),
  home_address_postal_code: z.string().optional(),
  home_address_country: z.string().optional(),
  
  // Mailing address (if different)
  mailing_address_same: z.boolean().optional(),
  mailing_address_street: z.string().optional(),
  mailing_address_city: z.string().optional(),
  mailing_address_state: z.string().optional(),
  mailing_address_postal_code: z.string().optional(),
  mailing_address_country: z.string().optional(),
  
  // Contact information
  primary_phone: z.string().optional(),
  secondary_phone: z.string().optional(),
  work_phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  
  // Social media
  have_social_media: z.boolean().optional(),
  social_media_platforms: z.array(z.object({
    platform: z.string(),
    identifier: z.string(),
  })).optional(),
});

// ============================================================================
// SECTION 4: PASSPORT INFORMATION
// ============================================================================

export const ds160PassportSchema = z.object({
  passport_number: z.string().optional(),
  passport_book_number: z.string().optional(),
  passport_country: z.string().optional(),
  passport_issue_city: z.string().optional(),
  passport_issue_date: z.string().optional(),
  passport_expiry_date: z.string().optional(),
  
  // Lost/stolen passport
  have_lost_passport: z.boolean().optional(),
  lost_passport_number: z.string().optional(),
  lost_passport_country: z.string().optional(),
  lost_passport_explanation: z.string().optional(),
});

// ============================================================================
// SECTION 5: FAMILY INFORMATION
// ============================================================================

export const ds160FamilySchema = z.object({
  // Father information
  father_surname: z.string().optional(),
  father_given_name: z.string().optional(),
  father_date_of_birth: z.string().optional(),
  father_in_us: z.boolean().optional(),
  father_us_status: z.string().optional(), // "US Citizen", "Legal Permanent Resident", etc.
  
  // Mother information
  mother_surname: z.string().optional(),
  mother_given_name: z.string().optional(),
  mother_date_of_birth: z.string().optional(),
  mother_in_us: z.boolean().optional(),
  mother_us_status: z.string().optional(),
  
  // Immediate relatives in US
  have_relatives_in_us: z.boolean().optional(),
  relatives_in_us: z.array(z.object({
    name: z.string(),
    relationship: z.string(),
    status: z.string(), // "US Citizen", "Legal Permanent Resident", "Other"
  })).optional(),
  
  // Spouse information (if married)
  spouse_surname: z.string().optional(),
  spouse_given_name: z.string().optional(),
  spouse_date_of_birth: z.string().optional(),
  spouse_nationality: z.string().optional(),
  spouse_city_of_birth: z.string().optional(),
  spouse_country_of_birth: z.string().optional(),
  spouse_address: z.string().optional(),
});

// ============================================================================
// SECTION 6: EDUCATION AND WORK
// ============================================================================

export const ds160EducationWorkSchema = z.object({
  // Primary occupation
  primary_occupation: z.string().optional(),
  
  // Education
  highest_education_level: z.enum([
    'primary',
    'secondary',
    'high_school',
    'university',
    'graduate',
    'doctorate',
    'other'
  ]).optional(),
  
  education_history: z.array(z.object({
    institution_name: z.string(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    course_of_study: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })).optional(),
  
  // Work experience
  current_employer: z.string().optional(),
  current_job_title: z.string().optional(),
  employer_address: z.string().optional(),
  employer_phone: z.string().optional(),
  employment_start_date: z.string().optional(),
  monthly_income: z.string().optional(),
  
  work_history: z.array(z.object({
    employer: z.string(),
    job_title: z.string(),
    address: z.string().optional(),
    supervisor_name: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    duties: z.string().optional(),
  })).optional(),
});

// ============================================================================
// SECTION 7: SECURITY AND BACKGROUND
// ============================================================================

export const ds160SecuritySchema = z.object({
  // Diseases
  have_communicable_disease: z.boolean().optional(),
  have_mental_disorder: z.boolean().optional(),
  have_drug_addiction: z.boolean().optional(),
  
  // Criminal history
  have_been_arrested: z.boolean().optional(),
  arrest_explanation: z.string().optional(),
  
  have_violated_controlled_substance_law: z.boolean().optional(),
  substance_violation_explanation: z.string().optional(),
  
  have_engaged_in_prostitution: z.boolean().optional(),
  
  have_been_involved_in_money_laundering: z.boolean().optional(),
  
  have_committed_human_trafficking: z.boolean().optional(),
  
  have_assisted_human_trafficking: z.boolean().optional(),
  
  have_family_in_human_trafficking: z.boolean().optional(),
  
  // Terrorism and espionage
  have_engaged_in_terrorist_activity: z.boolean().optional(),
  terrorist_activity_explanation: z.string().optional(),
  
  have_engaged_in_espionage: z.boolean().optional(),
  
  have_engaged_in_sabotage: z.boolean().optional(),
  
  have_engaged_in_genocide: z.boolean().optional(),
  
  // Other
  have_committed_fraud_for_visa: z.boolean().optional(),
  fraud_explanation: z.string().optional(),
  
  have_kidnapped_child: z.boolean().optional(),
  
  have_voted_unlawfully: z.boolean().optional(),
  
  have_renounced_citizenship_to_avoid_tax: z.boolean().optional(),
  
  // Overstay and deportation
  have_overstayed_us_visa: z.boolean().optional(),
  overstay_explanation: z.string().optional(),
  
  have_been_deported: z.boolean().optional(),
  deportation_explanation: z.string().optional(),
  
  have_custody_of_us_citizen_child: z.boolean().optional(),
  
  // Additional information
  additional_information: z.string().optional(),
});

// ============================================================================
// COMBINED SCHEMA FOR COMPLETE DS-160
// ============================================================================

export const ds160CompleteSchema = z.object({
  personal: ds160PersonalSchema,
  travel: ds160TravelSchema,
  address: ds160AddressSchema,
  passport: ds160PassportSchema,
  family: ds160FamilySchema,
  education_work: ds160EducationWorkSchema,
  security: ds160SecuritySchema,
});

// Type inference
export type DS160PersonalData = z.infer<typeof ds160PersonalSchema>;
export type DS160TravelData = z.infer<typeof ds160TravelSchema>;
export type DS160AddressData = z.infer<typeof ds160AddressSchema>;
export type DS160PassportData = z.infer<typeof ds160PassportSchema>;
export type DS160FamilyData = z.infer<typeof ds160FamilySchema>;
export type DS160EducationWorkData = z.infer<typeof ds160EducationWorkSchema>;
export type DS160SecurityData = z.infer<typeof ds160SecuritySchema>;
export type DS160CompleteData = z.infer<typeof ds160CompleteSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Calculate completion percentage for DS-160 form
 */
export function calculateDS160Completion(formData: Record<string, any>): number {
  const sections = [
    'personal',
    'travel', 
    'address',
    'passport',
    'family',
    'education_work',
    'security'
  ];
  
  let completedSections = 0;
  
  sections.forEach(section => {
    if (formData[section]) {
      const sectionData = formData[section];
      const filledFields = Object.values(sectionData).filter(val => 
        val !== null && val !== undefined && val !== ''
      ).length;
      
      // Consider section complete if at least 50% of fields are filled
      const totalFields = Object.keys(sectionData).length;
      if (filledFields / totalFields >= 0.5) {
        completedSections++;
      }
    }
  });
  
  return Math.round((completedSections / sections.length) * 100);
}

/**
 * Get list of completed sections
 */
export function getCompletedSections(formData: Record<string, any>): string[] {
  const sections = [
    'personal',
    'travel',
    'address', 
    'passport',
    'family',
    'education_work',
    'security'
  ];
  
  return sections.filter(section => {
    if (!formData[section]) return false;
    
    const sectionData = formData[section];
    const filledFields = Object.values(sectionData).filter(val => 
      val !== null && val !== undefined && val !== ''
    ).length;
    
    const totalFields = Object.keys(sectionData).length;
    return filledFields / totalFields >= 0.5;
  });
}

/**
 * Validate if DS-160 is ready for submission
 * (requires higher completion threshold than draft)
 */
export function isDS160ReadyForSubmission(formData: Record<string, any>): boolean {
  const completionPercentage = calculateDS160Completion(formData);
  return completionPercentage >= 80; // Must be at least 80% complete
}
