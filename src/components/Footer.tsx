import React from 'react';
import { RESEARCH_METADATA } from '../data/questionnaireData';
import { UserCheck, Mail, Phone, Lock } from 'lucide-react';

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
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-8 py-4 px-4 sm:px-6 transition-all">
      <div className="max-w-4xl mx-auto">
        {/* Main Footer Info: Researcher Detail & Researcher Access */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Researcher Contact Card */}
          <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 w-full md:w-auto flex-1">
            <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center shrink-0 text-indigo-400 border border-indigo-800/60 shadow-sm">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-100 text-xs sm:text-sm">{RESEARCH_METADATA.researcherName}</p>
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800/50">
                  Primary Investigator
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px]">
                <a
                  href={`mailto:${RESEARCH_METADATA.researcherEmail}`}
                  className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200 hover:underline font-mono"
                >
                  <Mail className="w-3 h-3 text-indigo-400" />
                  {RESEARCH_METADATA.researcherEmail}
                </a>
                <a
                  href={`tel:${RESEARCH_METADATA.researcherPhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 hover:underline font-mono font-semibold"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  {RESEARCH_METADATA.researcherPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Discreet Researcher Dashboard Access Icon Button */}
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 shrink-0">
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
      </div>
    </footer>
  );
};
