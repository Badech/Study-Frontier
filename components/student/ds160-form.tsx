/**
 * DS-160 Multi-Step Form Component
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Main form wrapper with stepper navigation and autosave.
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { DS160CompleteData } from '@/lib/validations/ds160';

interface DS160FormProps {
  initialData?: Partial<DS160CompleteData>;
  studentId: string;
  ds160Id?: string | null;
  onSave?: (data: Partial<DS160CompleteData>) => Promise<void>;
}

const SECTIONS = [
  { key: 'personal', label: 'Personal Information', description: 'Basic personal details' },
  { key: 'travel', label: 'Travel Information', description: 'Trip purpose and plans' },
  { key: 'address', label: 'Address & Contact', description: 'Contact information' },
  { key: 'passport', label: 'Passport', description: 'Passport details' },
  { key: 'family', label: 'Family', description: 'Family information' },
  { key: 'education_work', label: 'Education & Work', description: 'Education and employment' },
  { key: 'security', label: 'Security Questions', description: 'Background questions' },
];

export function DS160Form({ initialData, studentId, ds160Id, onSave }: DS160FormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DS160CompleteData>({
    defaultValues: initialData || {},
  });

  const formData = watch();

  // Autosave functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSave && formData) {
        handleAutosave();
      }
    }, 3000); // Save 3 seconds after last change

    return () => clearTimeout(timer);
  }, [formData]);

  const handleAutosave = async () => {
    if (!onSave) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      await onSave(formData);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Autosave error:', error);
      setSaveError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const goToSection = (index: number) => {
    if (index >= 0 && index < SECTIONS.length) {
      setCurrentSection(index);
    }
  };

  const currentSectionKey = SECTIONS[currentSection].key;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with save status */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">DS-160 Form</h1>
          <p className="text-sm text-gray-600 mt-1">
            Complete all sections. Your progress is automatically saved.
          </p>
        </div>
        <div className="text-sm text-gray-600">
          {isSaving && <span className="text-blue-600">Saving...</span>}
          {!isSaving && lastSaved && (
            <span className="text-green-600">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {saveError && <span className="text-red-600">{saveError}</span>}
        </div>
      </div>

      {/* Important disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notice</h3>
        <p className="text-sm text-yellow-800">
          This form is for <strong>review and preparation only</strong>. After we approve your
          information, you will need to submit it to the official U.S. government DS-160 website
          separately. We will guide you through that process.
        </p>
      </div>

      {/* Progress stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {SECTIONS.map((section, index) => (
            <div
              key={section.key}
              className="flex flex-col items-center flex-1"
            >
              <button
                type="button"
                onClick={() => goToSection(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  index === currentSection
                    ? 'bg-blue-600 text-white'
                    : index < currentSection
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
              <span className="text-xs mt-2 text-center max-w-20">
                {section.label.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentSection / (SECTIONS.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Section content */}
      <div className="bg-white rounded-lg border p-6 min-h-96">
        <h2 className="text-xl font-semibold mb-2">
          {SECTIONS[currentSection].label}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {SECTIONS[currentSection].description}
        </p>

        <form>
          {currentSectionKey === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Surname / Family Name *</label>
                  <input
                    {...register('personal.surname')}
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="As shown in passport"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Given Name *</label>
                  <input
                    {...register('personal.given_name')}
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="First and middle names"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Name in Native Alphabet</label>
                <input
                  {...register('personal.full_name_native')}
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="If applicable"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gender *</label>
                  <select {...register('personal.gender')} className="w-full px-3 py-2 border rounded-md">
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marital Status *</label>
                  <select {...register('personal.marital_status')} className="w-full px-3 py-2 border rounded-md">
                    <option value="">Select...</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                <input
                  {...register('personal.date_of_birth')}
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City of Birth *</label>
                  <input
                    {...register('personal.city_of_birth')}
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State/Province of Birth</label>
                  <input
                    {...register('personal.state_of_birth')}
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country of Birth *</label>
                  <input
                    {...register('personal.country_of_birth')}
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nationality *</label>
                <input
                  {...register('personal.nationality')}
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Current nationality"
                />
              </div>
            </div>
          )}

          {currentSectionKey === 'travel' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Purpose of Trip *</label>
                <select {...register('travel.purpose_of_trip')} className="w-full px-3 py-2 border rounded-md">
                  <option value="">Select...</option>
                  <option value="F1">F-1 (Student - Academic)</option>
                  <option value="F2">F-2 (Dependent of F-1)</option>
                  <option value="J1">J-1 (Exchange Visitor)</option>
                  <option value="B1/B2">B-1/B-2 (Visitor)</option>
                  <option value="M1">M-1 (Student - Vocational)</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Intended Date of Arrival</label>
                  <input
                    {...register('travel.intended_arrival_date')}
                    type="date"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Length of Stay</label>
                  <input
                    {...register('travel.intended_length_of_stay')}
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 4 years, 6 months"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address Where You Will Stay in the U.S.</label>
                <input
                  {...register('travel.intended_address_in_us')}
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    {...register('travel.intended_city')}
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    {...register('travel.intended_state')}
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input {...register('travel.have_been_to_us_before')} type="checkbox" />
                  <span className="text-sm">I have been to the United States before</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input {...register('travel.have_been_refused_visa')} type="checkbox" />
                  <span className="text-sm">I have been refused a U.S. visa before</span>
                </label>
              </div>

              {watch('travel.have_been_refused_visa') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Please explain</label>
                  <textarea
                    {...register('travel.visa_refusal_explanation')}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Provide details about the visa refusal..."
                  />
                </div>
              )}
            </div>
          )}

          {/* Placeholder for other sections - we'll implement these similarly */}
          {!['personal', 'travel'].includes(currentSectionKey) && (
            <div className="text-center py-12 text-gray-500">
              <p>{SECTIONS[currentSection].label} section coming soon</p>
              <p className="text-sm mt-2">This section will be fully implemented in the next iteration</p>
            </div>
          )}
        </form>
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => goToSection(currentSection - 1)}
          disabled={currentSection === 0}
          className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => goToSection(currentSection + 1)}
          disabled={currentSection === SECTIONS.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
