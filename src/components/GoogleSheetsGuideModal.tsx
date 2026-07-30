import React, { useState } from 'react';
import { getGoogleAppsScriptCode } from '../utils/googleSheetsSync';
import { X, Copy, Check, ExternalLink, FileCode, CheckCircle2 } from 'lucide-react';

interface GoogleSheetsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsGuideModal: React.FC<GoogleSheetsGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const code = getGoogleAppsScriptCode();

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-300 border border-purple-800 flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">
                Google Sheets Integration Guide
              </h3>
              <p className="text-xs text-slate-400">
                Connect your responses to Google Sheets in 60 seconds
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-900 text-purple-200 text-xs flex items-center justify-center font-mono">1</span>
              Create or Open a Google Sheet
            </h4>
            <p className="text-slate-300 pl-7">
              Go to Google Sheets (<a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-purple-300 underline inline-flex items-center gap-0.5">sheets.new <ExternalLink className="w-3 h-3" /></a>) and name your sheet (e.g. <em>BU SME AI Screening Data</em>).
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-900 text-purple-200 text-xs flex items-center justify-center font-mono">2</span>
              Open Apps Script Editor & Paste Code
            </h4>
            <p className="text-slate-300 pl-7">
              In Google Sheets, click <strong>Extensions &gt; Apps Script</strong>. Delete all code in <code>Code.gs</code> and paste the snippet below:
            </p>

            <div className="relative pl-7">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] max-h-48 overflow-y-auto text-slate-300">
                <pre>{code}</pre>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Code Copied to Clipboard!' : 'Copy Apps Script Code'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-900 text-purple-200 text-xs flex items-center justify-center font-mono">3</span>
              Deploy as Web App
            </h4>
            <ul className="list-disc pl-12 space-y-1 text-slate-300">
              <li>Click <strong>Deploy &gt; New deployment</strong></li>
              <li>Select type: <strong>Web app</strong></li>
              <li>Execute as: <strong>Me (your Google account)</strong></li>
              <li>Who has access: <strong>Anyone</strong> (allows anonymous respondents to post)</li>
              <li>Click <strong>Deploy</strong> and copy the generated <strong>Web App URL</strong></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-900 text-purple-200 text-xs flex items-center justify-center font-mono">4</span>
              Paste Web App URL into Researcher Settings
            </h4>
            <p className="text-slate-300 pl-7">
              Paste your copied Web App URL into the <strong>Google Sheets Webhook URL</strong> field in the Researcher Dashboard. All future questionnaire submissions will automatically append as structured rows in your Google Sheet!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all cursor-pointer"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
