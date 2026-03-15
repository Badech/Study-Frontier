/**
 * Eligibility Assessment Form Validation
 * PRD Section 12: Main website conversion flow
 * 2-step detailed assessment form for lead qualification
 */

import { z } from 'zod';

/**
 * Step 1: Basic Profile
 * Quick profile information
 */
export const assessmentStep1Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  whatsapp: z.string().min(10, 'Please enter a valid WhatsApp number').max(20),
  email: z.string().email('Please enter a valid email address'),
  city: z.string().min(2, 'City is required').max(100),
  nationality: z.string().min(2, 'Nationality is required').max(100),
  age: z.coerce.number().min(16, 'You must be at least 16 years old').max(100),
  preferredDestination: z.string().min(2, 'Please select a destination'),
  desiredIntake: z.string().min(2, 'Please select an intake period'),
});

/**
 * Step 2: Academic and Financial Fit
 * Detailed qualification information
 */
export const assessmentStep2Schema = z.object({
  highestEducation: z.string().min(2, 'Please select your education level'),
  currentSchool: z.string().max(200).optional(),
  gpa: z.string().min(1, 'Please enter your GPA or average').max(20),
  englishLevel: z.string().min(2, 'Please select your English level'),
  testStatus: z.string().min(2, 'Please select your test status'),
  desiredStudyLevel: z.string().min(2, 'Please select study level'),
  intendedMajor: z.string().min(2, 'Please enter your intended major').max(100),
  budgetRange: z.string().min(2, 'Please select your budget range'),
  sponsorType: z.string().min(2, 'Please select sponsor type'),
  priorVisaRefusal: z.enum(['yes', 'no'], {
    message: 'Please indicate if you have had a prior visa refusal',
  }),
  goalStatement: z.string().min(50, 'Please write at least 50 characters').max(1000, 'Maximum 1000 characters'),
});

/**
 * Complete Assessment Form
 * Combines both steps for API submission
 */
export const assessmentFormSchema = assessmentStep1Schema.merge(assessmentStep2Schema);

/**
 * Type exports for TypeScript
 */
export type AssessmentStep1Data = z.infer<typeof assessmentStep1Schema>;
export type AssessmentStep2Data = z.infer<typeof assessmentStep2Schema>;
export type AssessmentFormData = z.infer<typeof assessmentFormSchema>;

/**
 * Predefined options for select fields
 */
export const assessmentOptions = {
  destinations: [
    { value: 'usa', label: 'United States' },
    { value: 'canada', label: 'Canada (Future)' },
    { value: 'uk', label: 'United Kingdom (Future)' },
    { value: 'other', label: 'Other (Not yet supported)' },
  ],
  
  intakes: [
    { value: 'fall-2024', label: 'Fall 2024 (August - September)' },
    { value: 'spring-2025', label: 'Spring 2025 (January - February)' },
    { value: 'fall-2025', label: 'Fall 2025 (August - September)' },
    { value: 'spring-2026', label: 'Spring 2026 (January - February)' },
    { value: 'not-sure', label: 'Not Sure Yet' },
  ],
  
  educationLevels: [
    { value: 'high-school', label: 'High School (Baccalaureate)' },
    { value: 'some-college', label: 'Some College/University' },
    { value: 'bachelors', label: "Bachelor's Degree" },
    { value: 'masters', label: "Master's Degree" },
    { value: 'other', label: 'Other' },
  ],
  
  englishLevels: [
    { value: 'beginner', label: 'Beginner (A1-A2)' },
    { value: 'intermediate', label: 'Intermediate (B1-B2)' },
    { value: 'advanced', label: 'Advanced (C1-C2)' },
    { value: 'native', label: 'Native/Fluent' },
  ],
  
  testStatuses: [
    { value: 'not-taken', label: 'Not Taken Yet' },
    { value: 'planning', label: 'Planning to Take' },
    { value: 'registered', label: 'Registered for Test' },
    { value: 'completed', label: 'Test Completed' },
  ],
  
  studyLevels: [
    { value: 'bachelors', label: "Bachelor's Degree (Undergraduate)" },
    { value: 'masters', label: "Master's Degree (Graduate)" },
    { value: 'community-college', label: 'Community College (2-year)' },
    { value: 'pathway', label: 'Pathway Program / ESL' },
    { value: 'not-sure', label: 'Not Sure Yet' },
  ],
  
  budgetRanges: [
    { value: 'under-10k', label: 'Under $10,000/year' },
    { value: '10k-20k', label: '$10,000 - $20,000/year' },
    { value: '20k-30k', label: '$20,000 - $30,000/year' },
    { value: '30k-50k', label: '$30,000 - $50,000/year' },
    { value: 'over-50k', label: 'Over $50,000/year' },
    { value: 'flexible', label: 'Flexible / Depends on Scholarships' },
  ],
  
  sponsorTypes: [
    { value: 'self', label: 'Self-Funded' },
    { value: 'parents', label: 'Parents/Family' },
    { value: 'scholarship', label: 'Scholarship (Seeking)' },
    { value: 'loan', label: 'Student Loan' },
    { value: 'sponsor', label: 'External Sponsor' },
    { value: 'combination', label: 'Combination of Sources' },
  ],
} as const;
