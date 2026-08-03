import React from 'react';
import { PartEResponses } from '../types';
import { LIKERT_5_SCALE } from '../data/questionnaireData';
import { Sparkles, ChevronRight, ChevronLeft, Info } from 'lucide-react';

interface PartEProps {
  data: PartEResponses;
  onChange: (updated: Partial<PartEResponses>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PartE_BMI: React.FC<PartEProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const updateScale = (key: keyof PartEResponses, val: number) => {
    onChange({ [key]: val });
  };

  const isComplete =
    data.qE1_valueProposition > 0 &&
    data.qE2_valueCreationArchitecture > 0 &&
    data.qE3_revenueModel > 0 &&
    data.qE4_overallDepthChange > 0 &&
    data.qE5_explorationVsExploitation > 0;

  const items = [
    {
      key: 'qE1_valueProposition',
      code: 'E1',
      dimension: 'Value Proposition Innovation',
      statement:
        '“In the past two to three years, our firm has introduced changes to what we offer clients—new services, new features, or new ways of framing the value we provide where AI was a direct and necessary enabler—not simply a background tool that could have been replaced by a non-AI approach.”',
    },
    {
      key: 'qE2_valueCreationArchitecture',
      code: 'E2',
      dimension: 'Value Creation Architecture Innovation',
      statement:
        '“AI has changed how we organize work internally — including which roles, processes, team structures, or collaboration patterns are central to delivering our services to clients.”',
    },
    {
      key: 'qE3_revenueModel',
      code: 'E3',
      dimension: 'Revenue Model Innovation',
      statement:
        '“Our firm has introduced new or significantly changed pricing approaches, revenue streams, or ways of capturing value from clients that are specifically linked to AI-enabled service offerings.”',
    },
    {
      key: 'qE4_overallDepthChange',
      code: 'E4',
      dimension: 'Overall Depth of AI-Driven Business Model Change',
      statement:
        '“Overall, AI has been a significant factor in how our business model has changed — in terms of what we offer, how we create value, and how we generate revenue — over the past two to three years.”',
    },
    {
      key: 'qE5_explorationVsExploitation',
      code: 'E5',
      dimension: 'Exploration vs. Exploitation Orientation',
      statement:
        '“Our firm\'s use of AI has been primarily focused on improving our existing ways of working and delivering current services, rather than on experimenting with fundamentally new service offerings or business model configurations.”',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200">
              PART E
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Business Model Innovation Profile (Descriptive Profiling Only)
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            The following five statements describe changes that firms may have made to their business models in connection with AI over the past 2–3 years (grounded in Spieth & Schneider, 2016; Clauss, 2017).
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-indigo-900 bg-indigo-50/80 p-3 rounded-xl border border-indigo-100">
            <Info className="w-4 h-4 shrink-0 text-indigo-600" />
            <span>
              <strong className="font-bold text-indigo-950">Rating Scale:</strong> 1 = Strongly Disagree | 2 = Disagree | 3 = Neither | 4 = Agree | 5 = Strongly Agree
            </span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {items.map((item) => {
          const currentVal = data[item.key as keyof PartEResponses] || 0;

          return (
            <div
              key={item.key}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  {item.code} — {item.dimension}
                </span>
                {currentVal > 0 && (
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                    Score: {currentVal} / 5
                  </span>
                )}
              </div>

              <blockquote className="text-sm font-medium text-slate-800 leading-relaxed italic border-l-4 border-indigo-600 pl-3 py-1 bg-slate-50/50 rounded-r-lg">
                {item.statement}
              </blockquote>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-2">
                {LIKERT_5_SCALE.map((scale) => (
                  <button
                    key={scale.value}
                    type="button"
                    onClick={() => updateScale(item.key as keyof PartEResponses, scale.value)}
                    className={`py-2 px-1 sm:px-2 rounded-xl border-2 text-center transition-all text-xs font-bold cursor-pointer ${
                      currentVal === scale.value
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50'
                    }`}
                  >
                    <span className="block text-sm sm:text-base font-bold">{scale.value}</span>
                    <span className="hidden sm:block text-[10px] opacity-90 leading-tight mt-0.5 font-medium truncate">
                      {scale.label}
                    </span>
                  </button>
                ))}
              </div>
              {currentVal > 0 && (
                <div className="text-xs text-indigo-900 bg-indigo-50/80 px-3 py-2 rounded-lg font-medium border border-indigo-100 flex items-center justify-between">
                  <span className="text-slate-500">Selected Rating:</span>
                  <span className="font-bold text-indigo-700">
                    {currentVal} — {LIKERT_5_SCALE.find((s) => s.value === currentVal)?.label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center gap-2 border border-slate-200 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Part D</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
          className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
            isComplete
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
              : 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <span>Review & Submit Questionnaire</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
