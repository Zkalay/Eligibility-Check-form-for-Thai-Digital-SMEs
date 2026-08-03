import React from 'react';
import { RESEARCH_METADATA } from '../data/questionnaireData';
import { ShieldCheck, FileText } from 'lucide-react';

interface HeaderProps {
  currentStep?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentStep = 1 }) => {
  // On mobile devices (sm breakpoint or lower), hide top header on pages 2-5 to maximize workspace
  const isMobilePageTwoOrLater = currentStep > 1 && currentStep < 6;

  return (
    <header
      className={`bg-slate-900 text-white border-b border-slate-800 shadow-xl relative overflow-hidden transition-all ${
        isMobilePageTwoOrLater ? 'hidden sm:block' : 'block'
      }`}
    >
      {/* Decorative subtle background ambient glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 relative z-10">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Bangkok University | Master's Independent Study
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              PDPA Compliant & Ethics Approved
            </span>
          </div>

          <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-100 leading-snug pt-0.5">
            <span className="text-indigo-300 font-bold">{RESEARCH_METADATA.studyTitle}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
            {RESEARCH_METADATA.appendixTitle}
          </p>
        </div>
      </div>
    </header>
  );
};

