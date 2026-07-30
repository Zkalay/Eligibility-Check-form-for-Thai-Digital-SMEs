import React from 'react';
import { RESEARCH_METADATA } from '../data/questionnaireData';
import { ShieldCheck, UserCheck, FileText, Settings } from 'lucide-react';

interface HeaderProps {
  respondentId: string;
  isAnonymous: boolean;
  setIsAnonymous: (val: boolean) => void;
  onOpenAdmin: () => void;
  storedSubmissionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  storedSubmissionsCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xl relative overflow-hidden">
      {/* Decorative ambient subtle background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Bangkok University | Master's Independent Study
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                PDPA Compliant & Ethics Approved
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-slate-100">
              <span className="font-bold text-indigo-400">{RESEARCH_METADATA.studyTitle}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
              {RESEARCH_METADATA.appendixTitle}
            </p>
          </div>

          {/* Admin & Researcher quick toggle */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-indigo-500/50 shadow-sm cursor-pointer"
              title="Open Researcher Admin Dashboard"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>Researcher Dashboard</span>
              {storedSubmissionsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                  {storedSubmissionsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Researcher Information Bar */}
        <div className="pt-4 text-xs text-slate-300">
          <div className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 max-w-xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center shrink-0 text-indigo-400 border border-indigo-800/50">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">Researcher: {RESEARCH_METADATA.researcherName}</p>
              <p className="text-slate-400 font-mono text-[11px]">{RESEARCH_METADATA.researcherEmail} • {RESEARCH_METADATA.program}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
