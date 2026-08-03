import React from 'react';
import { RESEARCH_METADATA } from '../data/questionnaireData';
import { UserCheck, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  storedSubmissionsCount: number;
  currentStep?: number;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  storedSubmissionsCount,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-8 py-3 px-4 sm:px-6 transition-all">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Compact Researcher Info Card matching reference image */}
        <div className="flex items-center gap-3 bg-slate-800/60 px-3.5 py-2.5 rounded-xl border border-slate-700/60 w-full sm:w-auto flex-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center shrink-0 text-indigo-400 border border-indigo-800/50 shadow-sm">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-0.5 min-w-0">
            <p className="font-bold text-slate-100 text-xs sm:text-sm truncate">
              Researcher: {RESEARCH_METADATA.researcherName} <span className="text-indigo-300 font-medium text-xs">(Master Student)</span>
            </p>
            <p className="text-slate-300 font-mono text-[11px] flex flex-wrap items-center gap-x-2">
              <a href={`mailto:${RESEARCH_METADATA.researcherEmail}`} className="hover:text-indigo-300 hover:underline">
                {RESEARCH_METADATA.researcherEmail}
              </a>
              <span className="text-slate-500">•</span>
              <a href={`tel:${RESEARCH_METADATA.researcherPhone.replace(/\s+/g, '')}`} className="hover:text-emerald-300 hover:underline font-semibold text-emerald-300/90">
                {RESEARCH_METADATA.researcherPhone}
              </a>
            </p>
            <p className="text-slate-400 font-sans text-[11px] pt-0.5">
              {RESEARCH_METADATA.program}
            </p>
          </div>
        </div>

        {/* Discreet Researcher Dashboard Access Icon Button */}
        <div className="flex items-center justify-end gap-2.5 shrink-0 self-end sm:self-auto">
          <div className="text-right hidden sm:block text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300">Researcher Access</p>
            <p className="text-[10px]">Restricted to study admin</p>
          </div>
          
          <button
            type="button"
            onClick={onOpenAdmin}
            className="relative group p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500/60 transition-all shadow-md cursor-pointer flex items-center gap-2"
            title="Open Researcher Admin Dashboard"
            aria-label="Open Researcher Admin Dashboard"
          >
            <Lock className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold sm:hidden">Researcher Dashboard</span>
            {storedSubmissionsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white border border-slate-900 shadow-sm">
                {storedSubmissionsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};

