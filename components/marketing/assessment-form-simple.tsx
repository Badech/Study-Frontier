"use client";

/**
 * Simplified Assessment Form
 * Single-page version without complex state management
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type AssessmentFormSimpleProps = {
  locale: string;
};

export function AssessmentFormSimple({ locale }: AssessmentFormSimpleProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      whatsapp: formData.get('whatsapp'),
      email: formData.get('email'),
      city: formData.get('city'),
      nationality: formData.get('nationality'),
      age: parseInt(formData.get('age') as string),
      preferredDestination: formData.get('preferredDestination'),
      desiredIntake: formData.get('desiredIntake'),
      highestEducation: formData.get('highestEducation'),
      currentSchool: formData.get('currentSchool') || '',
      gpa: formData.get('gpa'),
      englishLevel: formData.get('englishLevel'),
      testStatus: formData.get('testStatus'),
      desiredStudyLevel: formData.get('desiredStudyLevel'),
      intendedMajor: formData.get('intendedMajor'),
      budgetRange: formData.get('budgetRange'),
      sponsorType: formData.get('sponsorType'),
      priorVisaRefusal: formData.get('priorVisaRefusal'),
      goalStatement: formData.get('goalStatement'),
    };

    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      router.push(`/${locale}/assessment/success`);
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Basic Info Section */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-5">
        <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
        
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
              WhatsApp <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">
              City <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label htmlFor="nationality" className="block text-sm font-medium mb-2">
              Nationality <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium mb-2">
              Age <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              id="age"
              name="age"
              required
              min="16"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="preferredDestination" className="block text-sm font-medium mb-2">
              Destination <span className="text-destructive">*</span>
            </label>
            <select
              id="preferredDestination"
              name="preferredDestination"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            >
              <option value="">Select...</option>
              <option value="usa">United States</option>
              <option value="canada">Canada (Future)</option>
            </select>
          </div>

          <div>
            <label htmlFor="desiredIntake" className="block text-sm font-medium mb-2">
              Desired Intake <span className="text-destructive">*</span>
            </label>
            <select
              id="desiredIntake"
              name="desiredIntake"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            >
              <option value="">Select...</option>
              <option value="fall-2024">Fall 2024</option>
              <option value="spring-2025">Spring 2025</option>
              <option value="fall-2025">Fall 2025</option>
              <option value="not-sure">Not Sure Yet</option>
            </select>
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-5">
        <h2 className="text-2xl font-bold mb-4">Academic Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="highestEducation" className="block text-sm font-medium mb-2">
              Highest Education <span className="text-destructive">*</span>
            </label>
            <select
              id="highestEducation"
              name="highestEducation"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            >
              <option value="">Select...</option>
              <option value="high-school">High School</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
            </select>
          </div>

          <div>
            <label htmlFor="gpa" className="block text-sm font-medium mb-2">
              GPA/Average <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="gpa"
              name="gpa"
              required
              placeholder="e.g., 3.5/4.0"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="currentSchool" className="block text-sm font-medium mb-2">
            Current School (Optional)
          </label>
          <input
            type="text"
            id="currentSchool"
            name="currentSchool"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="englishLevel" className="block text-sm font-medium mb-2">
              English Level <span className="text-destructive">*</span>
            </label>
            <select
              id="englishLevel"
              name="englishLevel"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            >
              <option value="">Select...</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label htmlFor="testStatus" className="block text-sm font-medium mb-2">
              Test Status <span className="text-destructive">*</span>
            </label>
            <select
              id="testStatus"
              name="testStatus"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            >
              <option value="">Select...</option>
              <option value="not-taken">Not Taken</option>
              <option value="planning">Planning to Take</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="desiredStudyLevel" className="block text-sm font-medium mb-2">
              Desired Study Level <span className="text-destructive">*</span>
            </label>
            <select
              id="desiredStudyLevel"
              name="desiredStudyLevel"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            >
              <option value="">Select...</option>
              <option value="bachelors">Bachelor's</option>
              <option value="masters">Master's</option>
              <option value="community-college">Community College</option>
            </select>
          </div>

          <div>
            <label htmlFor="intendedMajor" className="block text-sm font-medium mb-2">
              Intended Major <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="intendedMajor"
              name="intendedMajor"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Financial Info */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-5">
        <h2 className="text-2xl font-bold mb-4">Financial Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="budgetRange" className="block text-sm font-medium mb-2">
              Budget Range <span className="text-destructive">*</span>
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            >
              <option value="">Select...</option>
              <option value="under-10k">Under $10,000/year</option>
              <option value="10k-20k">$10,000 - $20,000/year</option>
              <option value="20k-30k">$20,000 - $30,000/year</option>
              <option value="over-30k">Over $30,000/year</option>
            </select>
          </div>

          <div>
            <label htmlFor="sponsorType" className="block text-sm font-medium mb-2">
              Sponsor Type <span className="text-destructive">*</span>
            </label>
            <select
              id="sponsorType"
              name="sponsorType"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
            >
              <option value="">Select...</option>
              <option value="self">Self-Funded</option>
              <option value="parents">Parents/Family</option>
              <option value="scholarship">Scholarship</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Prior U.S. Visa Refusal? <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="priorVisaRefusal" value="no" required />
              <span>No</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="priorVisaRefusal" value="yes" required />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="goalStatement" className="block text-sm font-medium mb-2">
            Your Goals <span className="text-destructive">*</span>
          </label>
          <textarea
            id="goalStatement"
            name="goalStatement"
            required
            rows={4}
            minLength={50}
            placeholder="Tell us about your study goals..."
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
        </Button>
      </div>
    </form>
  );
}
