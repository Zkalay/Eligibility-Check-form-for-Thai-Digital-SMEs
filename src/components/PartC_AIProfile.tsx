import React from 'react';
import { PartCResponses } from '../types';
import {
  AI_APPLICATION_TYPES,
  FUNCTIONAL_AREAS,
  LIKERT_5_FACTOR_SCALE,
} from '../data/questionnaireData';
import { Cpu, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';

interface PartCProps {
  data: PartCResponses;
  onChange: (updated: Partial<PartCResponses>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PartC_AIProfile: React.FC<PartCProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const toggleAiType = (item: string) => {
    const current = data.qC2_aiApplicationTypes || [];
    if (current.includes(item)) {
      onChange({ qC2_aiApplicationTypes: current.filter((x) => x !== item) });
    } else {
      onChange({ qC2_aiApplicationTypes: [...current, item] });
    }
  };

  const toggleFunctionalArea = (item: string) => {
    const current = data.qC3_functionalAreas || [];
    if (current.includes(item)) {
      onChange({ qC3_functionalAreas: current.filter((x) => x !== item) });
    } else {
      if (current.length < 3) {
        onChange({ qC3_functionalAreas: [...current, item] });
      }
    }
  };

  const updateShapingFactor = (key: keyof PartCResponses['qC5_shapingFactors'], val: number) => {
    onChange({
      qC5_shapingFactors: {
        ...data.qC5_shapingFactors,
        [key]: val,
      },
    });
  };

  const isC5Filled =
    data.qC5_shapingFactors.internalDataQuality > 0 &&
    data.qC5_shapingFactors.skillsKnowledge > 0 &&
    data.qC5_shapingFactors.financialResources > 0 &&
    data.qC5_shapingFactors.externalExpertise > 0 &&
    data.qC5_shapingFactors.institutionalSupport > 0;

  const isComplete =
    data.qC1_aiUsageDuration !== '' &&
    (data.qC2_aiApplicationTypes || []).length > 0 &&
    (data.qC3_functionalAreas || []).length > 0 &&
    data.qC4_integrationDepth !== '' &&
    isC5Filled;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200">
              PART C
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              AI Application Profile
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            This section maps your firm's current AI use to capture variation in AI integration depth and prepare contextually relevant questions for your interview.
          </p>
        </div>
      </div>

      {/* C1. Operating Duration */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question C1
          </span>
          <h3 className="text-base font-bold text-slate-800">
            How long has your firm been actively using AI in its operations or services? <span className="text-xs text-slate-500 font-normal">(select one)</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            'Less than 1 year',
            '1 – 2 years',
            '2 – 4 years',
            'More than 4 years',
          ].map((dur) => (
            <button
              key={dur}
              type="button"
              onClick={() => onChange({ qC1_aiUsageDuration: dur as any })}
              className={`p-3.5 rounded-xl border-2 text-xs font-bold text-center transition-all cursor-pointer ${
                data.qC1_aiUsageDuration === dur
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              {dur}
            </button>
          ))}
        </div>
      </div>

      {/* C2. Types of AI Applications */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question C2
          </span>
          <h3 className="text-base font-bold text-slate-800">
            Which types of AI applications does your firm currently use? <span className="text-xs text-indigo-600 font-semibold">(select all that apply)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AI_APPLICATION_TYPES.map((type) => {
            const isChecked = (data.qC2_aiApplicationTypes || []).includes(type);
            return (
              <label
                key={type}
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-xs font-medium cursor-pointer transition-all ${
                  isChecked
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-sm'
                    : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAiType(type)}
                  className="mt-0.5 accent-indigo-600 rounded cursor-pointer"
                />
                <span className="leading-snug">{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* C3. Functional Areas (Select up to 3) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Question C3
            </span>
            <h3 className="text-base font-bold text-slate-800">
              In which functional areas of your firm is AI most actively used?
            </h3>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              (data.qC3_functionalAreas || []).length === 3
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}
          >
            {(data.qC3_functionalAreas || []).length} / 3 selected
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Please select up to three primary functional areas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FUNCTIONAL_AREAS.map((area) => {
            const isSelected = (data.qC3_functionalAreas || []).includes(area);
            const isDisabled = !isSelected && (data.qC3_functionalAreas || []).length >= 3;

            return (
              <button
                key={area}
                type="button"
                onClick={() => toggleFunctionalArea(area)}
                disabled={isDisabled}
                className={`p-3.5 rounded-xl border-2 text-xs font-medium text-left flex items-start justify-between gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-sm'
                    : isDisabled
                    ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                    : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
                }`}
              >
                <span>{area}</span>
                {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* C4. Depth of AI Integration */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question C4
          </span>
          <h3 className="text-base font-bold text-slate-800">
            How would you describe the overall depth of AI integration in your firm at this time? <span className="text-xs text-slate-500 font-normal">(select one)</span>
          </h3>
        </div>

        <div className="space-y-2.5">
          {[
            {
              value: 'one_two_tasks',
              label: 'AI is used regularly in one or two specific tasks, but is not widely embedded across the firm',
            },
            {
              value: 'several_processes',
              label: 'AI is embedded in several processes across one or two business functions',
            },
            {
              value: 'multiple_core_functions',
              label: 'AI is integrated across multiple core functions and influences how we deliver services',
            },
            {
              value: 'central_business_model',
              label: 'AI is central to our business model — it shapes what we offer, how we create value, and how we generate revenue',
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-xs font-medium cursor-pointer transition-all ${
                data.qC4_integrationDepth === option.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              <input
                type="radio"
                name="qC4"
                value={option.value}
                checked={data.qC4_integrationDepth === option.value}
                onChange={() => onChange({ qC4_integrationDepth: option.value as any })}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="leading-relaxed">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* C5. Factors Shaping AI Capabilities (1 to 5 scale) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question C5
          </span>
          <h3 className="text-base font-bold text-slate-800">
            To what extent have the following factors shaped what your firm has been able to do with AI?
          </h3>
          <p className="text-xs text-slate-500">
            Rate each factor from <strong className="text-indigo-700 font-bold">1 (Not at all)</strong> to <strong className="text-indigo-700 font-bold">5 (Very significantly)</strong>.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              key: 'internalDataQuality',
              label: 'Quality or availability of our firm’s internal data',
            },
            {
              key: 'skillsKnowledge',
              label: 'Skills and AI-related knowledge of our team',
            },
            {
              key: 'financialResources',
              label: 'Financial resources and investment capacity',
            },
            {
              key: 'externalExpertise',
              label: 'Access to external AI expertise, partners, or vendors',
            },
            {
              key: 'institutionalSupport',
              label: 'Government or institutional support programs (e.g., DEPA, BOI)',
            },
          ].map((factor) => {
            const currentVal =
              data.qC5_shapingFactors[
                factor.key as keyof PartCResponses['qC5_shapingFactors']
              ] || 0;

            return (
              <div
                key={factor.key}
                className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3"
              >
                <p className="text-xs font-bold text-slate-800">{factor.label}</p>

                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {LIKERT_5_FACTOR_SCALE.map((scale) => (
                    <button
                      key={scale.value}
                      type="button"
                      onClick={() =>
                        updateShapingFactor(
                          factor.key as keyof PartCResponses['qC5_shapingFactors'],
                          scale.value
                        )
                      }
                      className={`py-2 px-1 rounded-xl border text-center transition-all text-xs font-bold cursor-pointer ${
                        currentVal === scale.value
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      <span className="block text-sm sm:text-base">{scale.value}</span>
                      <span className="hidden sm:block text-[10px] font-normal opacity-80 truncate">
                        {scale.label.split('-')[1]}
                      </span>
                    </button>
                  ))}
                </div>
                {currentVal > 0 && (
                  <div className="text-[11px] text-indigo-900 bg-white px-2.5 py-1.5 rounded-lg font-medium border border-indigo-100 flex items-center justify-between">
                    <span className="text-slate-400">Selected Extent:</span>
                    <span className="font-bold text-indigo-700">
                      {LIKERT_5_FACTOR_SCALE.find((s) => s.value === currentVal)?.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center gap-2 border border-slate-200 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Part B</span>
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
          <span>Continue to Part D (Absorptive Capacity)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
