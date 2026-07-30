import React from 'react';
import { QualificationStatus, PartAResponses } from '../types';
import { RESEARCH_METADATA } from '../data/questionnaireData';
import { AlertTriangle, RotateCcw, Mail, Building2, ChevronRight, Save } from 'lucide-react';

interface DisqualifiedNoticeProps {
  qualification: QualificationStatus;
  partA: PartAResponses;
  onEditPartA: () => void;
  onSaveIneligibleRecord: () => void;
}

export const DisqualifiedNotice: React.FC<DisqualifiedNoticeProps> = ({
  qualification,
  onEditPartA,
  onSaveIneligibleRecord,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
            Screening Result: Not Eligible for Interview Sample
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif">
            Thank You for Your Interest in Our Study
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We sincerely appreciate your time. Based on your screening responses, your firm does not currently meet one or more inclusion criteria for this specific research study sample on Thai Digital Service SMEs.
          </p>
        </div>

        {/* Failed Criteria Breakdown */}
        <div className="space-y-3 bg-slate-950/80 rounded-2xl p-5 border border-slate-800 text-xs">
          <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">
            Specific Exclusion Criteria Triggered:
          </h3>

          <div className="space-y-3 pt-1">
            {qualification.failedCriteria.map((fail) => (
              <div key={fail.code} className="p-3 bg-amber-950/20 rounded-xl border border-amber-800/30 space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-[10px]">
                    Criterion {fail.code}
                  </span>
                  <span>{fail.title}</span>
                </div>
                <p className="text-slate-300 leading-relaxed pl-1">{fail.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-purple-950/30 p-4 rounded-xl border border-purple-800/40 text-xs space-y-2">
          <p className="font-semibold text-purple-200 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-purple-400" />
            Questions or Clarifications?
          </p>
          <p className="text-slate-300">
            If you believe an answer was selected in error or if you have questions regarding the study scope, please reach out directly:
          </p>
          <p className="font-mono text-purple-300 font-semibold pt-1">
            Isaac Gon Hkaung (Zack) | {RESEARCH_METADATA.researcherEmail} | {RESEARCH_METADATA.researcherPhone}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onEditPartA}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-purple-400" />
            <span>Review / Modify Part A Answers</span>
          </button>

          <button
            type="button"
            onClick={onSaveIneligibleRecord}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-purple-400" />
            <span>Log Ineligible Response (Anonymously)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
