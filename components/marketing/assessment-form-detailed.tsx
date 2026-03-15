'use client';

/**
 * Detailed 2-Step Eligibility Assessment Form
 * Phase 1, Task 1.1
 * PRD Section 12: Main website conversion flow
 * 
 * Features:
 * - 2-step form for high-quality lead filtering
 * - 18+ fields across basic profile and academic/financial fit
 * - WhatsApp: +15716904684
 * - Email notifications to: contact@studyfrontier.com
 * - Mobile-first design
 * - Multi-language support
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  assessmentStep1Schema,
  assessmentStep2Schema,
  assessmentFormSchema,
  assessmentOptions,
  type AssessmentStep1Data,
  type AssessmentStep2Data,
  type AssessmentFormData,
} from '@/lib/validations/assessment';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export function AssessmentFormDetailed() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 form
  const step1Form = useForm<AssessmentStep1Data>({
    resolver: zodResolver(assessmentStep1Schema),
    mode: 'onBlur',
  });

  // Step 2 form
  const step2Form = useForm<AssessmentStep2Data>({
    resolver: zodResolver(assessmentStep2Schema),
    mode: 'onBlur',
  });

  // Handle Step 1 completion
  const handleStep1Submit = step1Form.handleSubmit(async (data) => {
    console.log('Step 1 data:', data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Handle full form submission
  const handleFinalSubmit = step2Form.handleSubmit(async (step2Data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const step1Data = step1Form.getValues();
      const fullData: AssessmentFormData = {
        ...step1Data,
        ...step2Data,
      };

      console.log('Submitting assessment:', fullData);

      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      const result = await response.json();
      console.log('Assessment submitted:', result);

      // Redirect to success page
      router.push('/en/assessment/success');
    } catch (err) {
      console.error('Assessment submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {step} of 2
          </span>
          <span className="text-sm text-muted-foreground">
            {step === 1 ? 'Basic Profile' : 'Academic & Financial Fit'}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Basic Profile */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Tell Us About Yourself</h2>
            <p className="text-muted-foreground">
              Let's start with some basic information to understand your profile.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              {...step1Form.register('fullName')}
              type="text"
              id="fullName"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your full name"
            />
            {step1Form.formState.errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.fullName.message}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-foreground mb-2">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              {...step1Form.register('whatsapp')}
              type="tel"
              id="whatsapp"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+212 6XX XXX XXX"
            />
            {step1Form.formState.errors.whatsapp && (
              <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.whatsapp.message}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">We'll reach out via WhatsApp for updates</p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              {...step1Form.register('email')}
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="your.email@example.com"
            />
            {step1Form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.email.message}</p>
            )}
          </div>

          {/* City and Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                {...step1Form.register('city')}
                type="text"
                id="city"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Casablanca"
              />
              {step1Form.formState.errors.city && (
                <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-foreground mb-2">
                Nationality <span className="text-red-500">*</span>
              </label>
              <input
                {...step1Form.register('nationality')}
                type="text"
                id="nationality"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Moroccan"
              />
              {step1Form.formState.errors.nationality && (
                <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.nationality.message}</p>
              )}
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-foreground mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              {...step1Form.register('age')}
              type="number"
              id="age"
              min="16"
              max="100"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your age"
            />
            {step1Form.formState.errors.age && (
              <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.age.message}</p>
            )}
          </div>

          {/* Preferred Destination */}
          <div>
            <label htmlFor="preferredDestination" className="block text-sm font-medium text-foreground mb-2">
              Preferred Study Destination <span className="text-red-500">*</span>
            </label>
            <select
              {...step1Form.register('preferredDestination')}
              id="preferredDestination"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a destination</option>
              {assessmentOptions.destinations.map((dest) => (
                <option key={dest.value} value={dest.value}>
                  {dest.label}
                </option>
              ))}
            </select>
            {step1Form.formState.errors.preferredDestination && (
              <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.preferredDestination.message}</p>
            )}
          </div>

          {/* Desired Intake */}
          <div>
            <label htmlFor="desiredIntake" className="block text-sm font-medium text-foreground mb-2">
              When do you want to start? <span className="text-red-500">*</span>
            </label>
            <input
              {...step1Form.register('desiredIntake')}
              type="text"
              id="desiredIntake"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Fall 2026, September 2026, or Not sure yet"
            />
            {step1Form.formState.errors.desiredIntake && (
              <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.desiredIntake.message}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your preferred start date or semester
            </p>
          </div>

          {/* Next Button */}
          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full">
              Continue to Step 2
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Academic & Financial Fit */}
      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Academic & Financial Profile</h2>
            <p className="text-muted-foreground">
              Help us understand your academic background and financial readiness.
            </p>
          </div>

          {/* Highest Education */}
          <div>
            <label htmlFor="highestEducation" className="block text-sm font-medium text-foreground mb-2">
              Highest Education Completed <span className="text-red-500">*</span>
            </label>
            <select
              {...step2Form.register('highestEducation')}
              id="highestEducation"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select your education level</option>
              {assessmentOptions.educationLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {step2Form.formState.errors.highestEducation && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.highestEducation.message}</p>
            )}
          </div>

          {/* Current School */}
          <div>
            <label htmlFor="currentSchool" className="block text-sm font-medium text-foreground mb-2">
              Current or Last School/University
            </label>
            <input
              {...step2Form.register('currentSchool')}
              type="text"
              id="currentSchool"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Name of your school or university"
            />
            {step2Form.formState.errors.currentSchool && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.currentSchool.message}</p>
            )}
          </div>

          {/* GPA */}
          <div>
            <label htmlFor="gpa" className="block text-sm font-medium text-foreground mb-2">
              GPA or Average Score <span className="text-red-500">*</span>
            </label>
            <input
              {...step2Form.register('gpa')}
              type="text"
              id="gpa"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 3.5/4.0, 15/20, 85%, or Good"
            />
            {step2Form.formState.errors.gpa && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.gpa.message}</p>
            )}
          </div>

          {/* English Level */}
          <div>
            <label htmlFor="englishLevel" className="block text-sm font-medium text-foreground mb-2">
              English Language Level <span className="text-red-500">*</span>
            </label>
            <select
              {...step2Form.register('englishLevel')}
              id="englishLevel"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select your English level</option>
              {assessmentOptions.englishLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {step2Form.formState.errors.englishLevel && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.englishLevel.message}</p>
            )}
          </div>

          {/* Test Status */}
          <div>
            <label htmlFor="testStatus" className="block text-sm font-medium text-foreground mb-2">
              TOEFL/IELTS Test Status <span className="text-red-500">*</span>
            </label>
            <select
              {...step2Form.register('testStatus')}
              id="testStatus"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select test status</option>
              {assessmentOptions.testStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {step2Form.formState.errors.testStatus && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.testStatus.message}</p>
            )}
          </div>

          {/* Desired Study Level */}
          <div>
            <label htmlFor="desiredStudyLevel" className="block text-sm font-medium text-foreground mb-2">
              Desired Study Level <span className="text-red-500">*</span>
            </label>
            <select
              {...step2Form.register('desiredStudyLevel')}
              id="desiredStudyLevel"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select study level</option>
              {assessmentOptions.studyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {step2Form.formState.errors.desiredStudyLevel && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.desiredStudyLevel.message}</p>
            )}
          </div>

          {/* Intended Major */}
          <div>
            <label htmlFor="intendedMajor" className="block text-sm font-medium text-foreground mb-2">
              Intended Major or Field of Study <span className="text-red-500">*</span>
            </label>
            <input
              {...step2Form.register('intendedMajor')}
              type="text"
              id="intendedMajor"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Computer Science, Business, Engineering"
            />
            {step2Form.formState.errors.intendedMajor && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.intendedMajor.message}</p>
            )}
          </div>

          {/* Budget Range */}
          <div>
            <label htmlFor="budgetRange" className="block text-sm font-medium text-foreground mb-2">
              Annual Budget Range (USD) <span className="text-red-500">*</span>
            </label>
            <select
              {...step2Form.register('budgetRange')}
              id="budgetRange"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select budget range</option>
              {assessmentOptions.budgetRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            {step2Form.formState.errors.budgetRange && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.budgetRange.message}</p>
            )}
          </div>

          {/* Sponsor Type */}
          <div>
            <label htmlFor="sponsorType" className="block text-sm font-medium text-foreground mb-2">
              How will you fund your studies? <span className="text-red-500">*</span>
            </label>
            <select
              {...step2Form.register('sponsorType')}
              id="sponsorType"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select sponsor type</option>
              {assessmentOptions.sponsorTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {step2Form.formState.errors.sponsorType && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.sponsorType.message}</p>
            )}
          </div>

          {/* Prior Visa Refusal */}
          <div>
            <label htmlFor="priorVisaRefusal" className="block text-sm font-medium text-foreground mb-2">
              Have you had a prior U.S. visa refusal? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  {...step2Form.register('priorVisaRefusal')}
                  type="radio"
                  value="no"
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">No</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  {...step2Form.register('priorVisaRefusal')}
                  type="radio"
                  value="yes"
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Yes</span>
              </label>
            </div>
            {step2Form.formState.errors.priorVisaRefusal && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.priorVisaRefusal.message}</p>
            )}
          </div>

          {/* Goal Statement */}
          <div>
            <label htmlFor="goalStatement" className="block text-sm font-medium text-foreground mb-2">
              What are your study goals? <span className="text-red-500">*</span>
            </label>
            <textarea
              {...step2Form.register('goalStatement')}
              id="goalStatement"
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Share your academic and career goals (50-1000 characters)"
            />
            {step2Form.formState.errors.goalStatement && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.goalStatement.message}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {step2Form.watch('goalStatement')?.length || 0} / 1000 characters
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Assessment'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
