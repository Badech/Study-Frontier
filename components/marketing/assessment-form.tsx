"use client";

/**
 * Eligibility Assessment Form Component
 * PRD Section 12: 2-step detailed assessment form
 * Main lead generation mechanism
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  AssessmentStep1Data,
  AssessmentStep2Data,
  AssessmentFormData,
  assessmentStep1Schema,
  assessmentStep2Schema,
  assessmentFormSchema,
  assessmentOptions,
} from '@/lib/validations/assessment';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

type AssessmentFormProps = {
  locale: string;
};

export function AssessmentForm({ locale }: AssessmentFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<AssessmentStep1Data | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 form
  const step1Form = useForm({
    resolver: zodResolver(assessmentStep1Schema),
    defaultValues: step1Data || undefined,
  });

  // Step 2 form
  const step2Form = useForm({
    resolver: zodResolver(assessmentStep2Schema),
  });

  // Handle Step 1 submission
  const handleStep1Submit = (data: AssessmentStep1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Step 2 submission (final)
  const handleStep2Submit = async (data: AssessmentStep2Data) => {
    if (!step1Data) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const completeData: AssessmentFormData = {
        ...step1Data,
        ...data,
      };

      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      // Redirect to success page
      router.push(`/${locale}/assessment/success`);
    } catch (err) {
      console.error('Assessment submission error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to Step 1
  const handleBackToStep1 = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'
            }`}>
              {currentStep > 1 ? <CheckCircle2 className="h-5 w-5" /> : '1'}
            </div>
            <span className={`text-sm font-medium ${currentStep === 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Basic Profile
            </span>
          </div>
          <div className="h-0.5 flex-1 mx-4 bg-border">
            <div className={`h-full bg-primary transition-all ${currentStep === 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <span className={`text-sm font-medium ${currentStep === 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Academic & Financial Fit
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {currentStep} of 2
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Step 1: Basic Profile */}
      {currentStep === 1 && (
        <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Basic Profile</h2>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  {...step1Form.register('fullName')}
                  type="text"
                  id="fullName"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your full name as it appears on your passport"
                />
                {step1Form.formState.errors.fullName && (
                  <p className="mt-1 text-sm text-destructive">{step1Form.formState.errors.fullName.message}</p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
                  WhatsApp Number <span className="text-destructive">*</span>
                </label>
                <input
                  {...step1Form.register('whatsapp')}
                  type="tel"
                  id="whatsapp"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="+212 6XX XXX XXX"
                />
                {step1Form.formState.errors.whatsapp && (
                  <p className="mt-1 text-sm text-destructive">{step1Form.formState.errors.whatsapp.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  {...step1Form.register('email')}
                  type="email"
                  id="email"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="your.email@example.com"
                />
                {step1Form.formState.errors.email && (
                  <p className="mt-1 text-sm text-destructive">{step1Form.formState.errors.email.message}</p>
                )}
              </div>

              {/* City & Nationality */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-2">
                    City <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...step1Form.register('city')}
                    type="text"
                    id="city"
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Casablanca, Rabat, etc."
                  />
                  {step1Form.formState.errors.city && (
                    <p className="mt-1 text-sm text-destructive">{step1Form.formState.errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium mb-2">
                    Nationality <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...step1Form.register('nationality')}
                    type="text"
                    id="nationality"
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Moroccan"
                  />
                  {step1Form.formState.errors.nationality && (
                    <p className="mt-1 text-sm text-destructive">{step1Form.formState.errors.nationality.message}</p>
                  )}
                </div>
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium mb-2">
                  Age <span className="text-destructive">*</span>
                </label>
                <input
                  {...step1Form.register('age')}
                  type="number"
                  id="age"
                  min="16"
                  max="100"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your current age"
                />
                {step1Form.formState.errors.age && (
                  <p className="mt-1 text-sm text-destructive">{step1Form.formState.errors.age.message}</p>
                )}
              </div>

              {/* Preferred Destination */}
              <div>
                <label htmlFor="preferredDestination" className="block text-sm font-medium mb-2">
                  Preferred Study Destination <span className="text-destructive">*</span>
                </label>
                <select
                  {...step1Form.register('preferredDestination')}
                  id="preferredDestination"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select destination</option>
                  {assessmentOptions.destinations.map((dest) => (
                    <option key={dest.value} value={dest.value}>
                      {dest.label}
                    </option>
                  ))}
                </select>
                {step1Form.formState.errors.preferredDestination && (
                  <p className="mt-1 text-sm text-destructive">{step1Form.formState.errors.preferredDestination.message}</p>
                )}
              </div>

              {/* Desired Intake */}
              <div>
                <label htmlFor="desiredIntake" className="block text-sm font-medium mb-2">
                  Desired Intake Period <span className="text-destructive">*</span>
                </label>
                <select
                  {...step1Form.register('desiredIntake')}
                  id="desiredIntake"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select intake</option>
                  {assessmentOptions.intakes.map((intake) => (
                    <option key={intake.value} value={intake.value}>
                      {intake.label}
                    </option>
                  ))}
                </select>
                {step1Form.formState.errors.desiredIntake && (
                  <p className="mt-1 text-sm text-destructive">{step1Form.formState.errors.desiredIntake.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Continue to Step 2 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Academic & Financial Fit */}
      {currentStep === 2 && (
        <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Academic & Financial Fit</h2>

            <div className="space-y-5">
              {/* Highest Education */}
              <div>
                <label htmlFor="highestEducation" className="block text-sm font-medium mb-2">
                  Highest Education Completed <span className="text-destructive">*</span>
                </label>
                <select
                  {...step2Form.register('highestEducation')}
                  id="highestEducation"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select education level</option>
                  {assessmentOptions.educationLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {step2Form.formState.errors.highestEducation && (
                  <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.highestEducation.message}</p>
                )}
              </div>

              {/* Current School */}
              <div>
                <label htmlFor="currentSchool" className="block text-sm font-medium mb-2">
                  Current School/University <span className="text-muted-foreground">(Optional)</span>
                </label>
                <input
                  {...step2Form.register('currentSchool')}
                  type="text"
                  id="currentSchool"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Name of your current or last school"
                />
                {step2Form.formState.errors.currentSchool && (
                  <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.currentSchool.message}</p>
                )}
              </div>

              {/* GPA */}
              <div>
                <label htmlFor="gpa" className="block text-sm font-medium mb-2">
                  GPA / Average <span className="text-destructive">*</span>
                </label>
                <input
                  {...step2Form.register('gpa')}
                  type="text"
                  id="gpa"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g., 3.5/4.0 or 15/20 or 85%"
                />
                {step2Form.formState.errors.gpa && (
                  <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.gpa.message}</p>
                )}
              </div>

              {/* English Level & Test Status */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="englishLevel" className="block text-sm font-medium mb-2">
                    English Level <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...step2Form.register('englishLevel')}
                    id="englishLevel"
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select level</option>
                    {assessmentOptions.englishLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {step2Form.formState.errors.englishLevel && (
                    <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.englishLevel.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="testStatus" className="block text-sm font-medium mb-2">
                    TOEFL/IELTS Status <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...step2Form.register('testStatus')}
                    id="testStatus"
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select status</option>
                    {assessmentOptions.testStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {step2Form.formState.errors.testStatus && (
                    <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.testStatus.message}</p>
                  )}
                </div>
              </div>

              {/* Desired Study Level */}
              <div>
                <label htmlFor="desiredStudyLevel" className="block text-sm font-medium mb-2">
                  Desired Study Level <span className="text-destructive">*</span>
                </label>
                <select
                  {...step2Form.register('desiredStudyLevel')}
                  id="desiredStudyLevel"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select study level</option>
                  {assessmentOptions.studyLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {step2Form.formState.errors.desiredStudyLevel && (
                  <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.desiredStudyLevel.message}</p>
                )}
              </div>

              {/* Intended Major */}
              <div>
                <label htmlFor="intendedMajor" className="block text-sm font-medium mb-2">
                  Intended Major/Field of Study <span className="text-destructive">*</span>
                </label>
                <input
                  {...step2Form.register('intendedMajor')}
                  type="text"
                  id="intendedMajor"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g., Computer Science, Business, Engineering"
                />
                {step2Form.formState.errors.intendedMajor && (
                  <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.intendedMajor.message}</p>
                )}
              </div>

              {/* Budget Range */}
              <div>
                <label htmlFor="budgetRange" className="block text-sm font-medium mb-2">
                  Budget Range (Annual) <span className="text-destructive">*</span>
                </label>
                <select
                  {...step2Form.register('budgetRange')}
                  id="budgetRange"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select budget range</option>
                  {assessmentOptions.budgetRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                {step2Form.formState.errors.budgetRange && (
                  <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.budgetRange.message}</p>
                )}
              </div>

              {/* Sponsor Type */}
              <div>
                <label htmlFor="sponsorType" className="block text-sm font-medium mb-2">
                  Sponsor Type <span className="text-destructive">*</span>
                </label>
                <select
                  {...step2Form.register('sponsorType')}
                  id="sponsorType"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select sponsor type</option>
                  {assessmentOptions.sponsorTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {step2Form.formState.errors.sponsorType && (
                  <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.sponsorType.message}</p>
                )}
              </div>

              {/* Prior Visa Refusal */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Have you had a prior U.S. visa refusal? <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...step2Form.register('priorVisaRefusal')}
                      type="radio"
                      value="no"
                      className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm">No</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...step2Form.register('priorVisaRefusal')}
                      type="radio"
                      value="yes"
                      className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                </div>
                {step2Form.formState.errors.priorVisaRefusal && (
                  <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.priorVisaRefusal.message}</p>
                )}
              </div>

              {/* Goal Statement */}
              <div>
                <label htmlFor="goalStatement" className="block text-sm font-medium mb-2">
                  Short Goal Statement <span className="text-destructive">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Tell us briefly about your study goals and why you want to pursue education in the USA (50-1000 characters)
                </p>
                <textarea
                  {...step2Form.register('goalStatement')}
                  id="goalStatement"
                  rows={5}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="I want to study in the USA because..."
                />
                {step2Form.formState.errors.goalStatement && (
                  <p className="mt-1 text-sm text-destructive">{step2Form.formState.errors.goalStatement.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" size="lg" onClick={handleBackToStep1}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Step 1
            </Button>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
