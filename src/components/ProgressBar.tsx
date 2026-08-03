import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

export interface StepItem {
  id: number;
  key: string;
  label: string;
  shortLabel: string;
  description: string;
}

export const STEPS: StepItem[] = [
  {
    id: 1,
    key: 'partA',
    label: 'Eligibility Screening',
    shortLabel: 'Eligibility',
    description: 'Inclusion criteria check (A1–A6)',
  },
  {
    id: 2,
    key: 'partB',
    label: 'Firm Background',
    shortLabel: 'Background',
    description: 'Demographics & firm profile (B1–B7)',
  },
  {
    id: 3,
    key: 'partC',
    label: 'AI Profile',
    shortLabel: 'AI Profile',
    description: 'Current AI adoption & factors (C1–C5)',
  },
  {
    id: 4,
    key: 'partD',
    label: 'Absorptive Capacity',
    shortLabel: 'ACAP Scale',
    description: 'Knowledge processes assessment (D1–D6)',
  },
  {
    id: 5,
    key: 'partE',
    label: 'Business Model Innovation',
    shortLabel: 'BMI Scale',
    description: 'AI-driven business model change (E1–E5)',
  },
  {
    id: 6,
    key: 'review',
    label: 'Review & Submit',
    shortLabel: 'Review',
    description: 'Final check & Google Sheets dispatch',
  },
];

interface ProgressBarProps {
  currentStep: number;
  onStepClick: (stepId: number) => void;
  isEligible: boolean;
  partACompleted: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  onStepClick,
  isEligible,
  partACompleted,
}) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        {/* Mobile View */}
        <div className="md:hidden space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <span className="text-indigo-400 font-bold">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-slate-100 font-semibold">{STEPS[currentStep - 1]?.label}</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop Step Pills */}
        <div className="hidden md:flex items-center justify-between gap-2 overflow-x-auto py-1">
          {STEPS.map((step) => {
            const isCurrent = currentStep === step.id;
            const isPassed = currentStep > step.id;
            const isDisabled = step.id > 1 && partACompleted && !isEligible;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => !isDisabled && onStepClick(step.id)}
                disabled={isDisabled}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 border cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-900/30'
                    : isPassed
                    ? 'bg-slate-800/90 text-indigo-300 border-slate-700 hover:bg-slate-800'
                    : isDisabled
                    ? 'bg-slate-900/50 text-slate-600 border-slate-800/50 cursor-not-allowed opacity-60'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isPassed
                      ? 'bg-indigo-500 text-slate-950'
                      : isCurrent
                      ? 'bg-white text-indigo-700'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                </div>

                <div className="text-left">
                  <p className="whitespace-nowrap leading-tight">{step.shortLabel}</p>
                </div>

                {step.id === 1 && partACompleted && !isEligible && (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 ml-1 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
