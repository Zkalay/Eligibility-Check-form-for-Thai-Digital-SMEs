import React from 'react';
import { PartDResponses } from '../types';
import { LIKERT_5_SCALE } from '../data/questionnaireData';
import { Brain, ChevronRight, ChevronLeft, Info } from 'lucide-react';

interface PartDProps {
  data: PartDResponses;
  onChange: (updated: Partial<PartDResponses>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PartD_ACAP: React.FC<PartDProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const updateScale = (key: keyof PartDResponses, val: number) => {
    onChange({ [key]: val });
  };

  const isComplete =
    data.qD1_knowledgeAcquisition > 0 &&
    data.qD2_knowledgeAssimilation > 0 &&
    data.qD3_knowledgeTransformation > 0 &&
    data.qD4_knowledgeExploitation > 0 &&
    data.qD5_potentialRealizedGap > 0 &&
    data.qD6_reverseAssimilation > 0;

  const items = [
    {
      key: 'qD1_knowledgeAcquisition',
      code: 'D1',
      dimension: 'Knowledge Acquisition',
      statement:
        '“Our firm consistently monitors external sources—such as industry events, professional networks, publications, or technology partners—to stay informed about new AI developments relevant to our services.”',
    },
    {
      key: 'qD2_knowledgeAssimilation',
      code: 'D2',
      dimension: 'Knowledge Assimilation',
      statement:
        '“When new AI-related information enters our firm, we have a shared process for evaluating what it means and deciding how to respond to it.”',
    },
    {
      key: 'qD3_knowledgeTransformation',
      code: 'D3',
      dimension: 'Knowledge Transformation',
      statement:
        '“Our firm is able to combine new AI-related knowledge with our existing expertise, routines, and ways of working to develop new approaches, processes, or solutions.”',
    },
    {
      key: 'qD4_knowledgeExploitation',
      code: 'D4',
      dimension: 'Knowledge Exploitation',
      statement:
        '“Our firm has successfully translated AI-related knowledge into concrete changes in our services, internal processes, or how we deliver and capture value for clients.”',
    },
    {
      key: 'qD5_potentialRealizedGap',
      code: 'D5',
      dimension: 'Potential–Realized ACAP Gap',
      statement:
        '“There have been cases where our firm recognized the value of an AI-related idea and understood it reasonably well, but we were unable to put it into practice due to internal constraints such as resources, skills, or data limitations.”',
    },
    {
      key: 'qD6_reverseAssimilation',
      code: 'D6',
      dimension: 'Additional Knowledge Process Item',
      statement:
        '“There have been cases where our firm encountered promising AI-related knowledge but lacked a clear process for deciding how to act on it.”',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 text-indigo-600">
            <Brain className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200">
                PART D
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Absorptive Capacity Profile (Descriptive Profiling Only)
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The following six statements describe how firms typically work with knowledge about new technologies such as AI. These items are used exclusively for descriptive profiling of your firm's knowledge processes (grounded in Zahra & George, 2002).
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-indigo-900 bg-indigo-50/80 p-3 rounded-xl border border-indigo-100">
              <Info className="w-4 h-4 shrink-0 text-indigo-600" />
              <span>
                <strong className="font-bold text-indigo-950">Rating Scale:</strong> 1 = Strongly Disagree | 2 = Disagree | 3 = Neither | 4 = Agree | 5 = Strongly Agree
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {items.map((item) => {
          const currentVal = data[item.key as keyof PartDResponses] || 0;

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
                    onClick={() => updateScale(item.key as keyof PartDResponses, scale.value)}
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
          <span>Back to Part C</span>
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
          <span>Continue to Part E (Business Model Innovation)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
