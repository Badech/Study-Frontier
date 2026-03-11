/**
 * Visa Checklist Component
 * Sprint 07: DS-160 and Visa Workflow
 * 
 * Displays visa preparation checklist with completion status.
 */

'use client';

import { useState } from 'react';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  required: boolean;
}

interface VisaChecklistProps {
  items: ChecklistItem[];
  onItemToggle?: (itemId: string, completed: boolean) => void;
  readOnly?: boolean;
}

const DEFAULT_CHECKLIST_ITEMS: Omit<ChecklistItem, 'completed'>[] = [
  {
    id: 'ds160',
    title: 'DS-160 Form Completed',
    description: 'Complete and submit DS-160 form for review',
    required: true,
  },
  {
    id: 'passport',
    title: 'Valid Passport',
    description: 'Passport valid for at least 6 months beyond intended stay',
    required: true,
  },
  {
    id: 'i20',
    title: 'I-20 Form from School',
    description: 'Certificate of Eligibility for F-1 student status',
    required: true,
  },
  {
    id: 'sevis_fee',
    title: 'SEVIS Fee Payment',
    description: 'I-901 SEVIS fee payment receipt',
    required: true,
  },
  {
    id: 'photo',
    title: 'Visa Photo',
    description: '2x2 inch photo meeting visa requirements',
    required: true,
  },
  {
    id: 'financial_docs',
    title: 'Financial Documents',
    description: 'Bank statements, sponsor letters, scholarship letters',
    required: true,
  },
  {
    id: 'academic_docs',
    title: 'Academic Documents',
    description: 'Transcripts, diplomas, test scores',
    required: true,
  },
  {
    id: 'interview_appointment',
    title: 'Interview Appointment Scheduled',
    description: 'Confirmed appointment at U.S. Embassy/Consulate',
    required: true,
  },
  {
    id: 'mock_interview',
    title: 'Mock Interview Completed',
    description: 'Practice interview with counselor',
    required: false,
  },
];

export function VisaChecklist({ items, onItemToggle, readOnly = false }: VisaChecklistProps) {
  const checklistItems = items.length > 0 ? items : DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item, completed: false }));
  
  const completedCount = checklistItems.filter(item => item.completed).length;
  const requiredCount = checklistItems.filter(item => item.required).length;
  const completedRequiredCount = checklistItems.filter(item => item.required && item.completed).length;

  const handleToggle = (itemId: string, currentStatus: boolean) => {
    if (readOnly || !onItemToggle) return;
    onItemToggle(itemId, !currentStatus);
  };

  return (
    <div className="space-y-4">
      {/* Progress summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-semibold">
            {completedCount} of {checklistItems.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Required items: {completedRequiredCount} of {requiredCount} completed
        </p>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {checklistItems.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg p-4 transition-colors ${
              item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                type="button"
                onClick={() => handleToggle(item.id, item.completed)}
                disabled={readOnly}
                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  readOnly ? 'cursor-default' : 'cursor-pointer'
                } ${
                  item.completed
                    ? 'bg-green-600 border-green-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {item.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className={`font-medium ${item.completed ? 'text-green-900' : 'text-gray-900'}`}>
                    {item.title}
                  </h4>
                  {item.required && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
