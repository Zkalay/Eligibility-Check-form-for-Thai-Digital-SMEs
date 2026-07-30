import React, { useState, useEffect } from 'react';
import { QuestionnaireSubmission, GoogleSheetsConfig } from '../types';
import {
  getStoredSubmissions,
  fetchSubmissionsFromServer,
  deleteSubmissionLocally,
  exportSubmissionsToCSV,
  getStoredConfig,
  saveStoredConfig,
  syncToGoogleSheets,
} from '../utils/googleSheetsSync';
import {
  Settings,
  Database,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  HelpCircle,
  FileSpreadsheet,
  X,
  ExternalLink,
  ChevronDown,
  Lock,
  KeyRound,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGuide: () => void;
}

const DEFAULT_ADMIN_PASSWORD = 'QB]Q9(T6c+biDhG9}wgj6Y:Y^<E[;549Nk(RvQ(';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onOpenGuide,
}) => {
  const [submissions, setSubmissions] = useState<QuestionnaireSubmission[]>(getStoredSubmissions());
  const [config, setConfig] = useState<GoogleSheetsConfig>(getStoredConfig());
  const [search, setSearch] = useState('');
  const [filterQual, setFilterQual] = useState<'ALL' | 'QUALIFIED' | 'DISQUALIFIED'>('ALL');
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [selectedSub, setSelectedSub] = useState<QuestionnaireSubmission | null>(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem('bu_researcher_admin_auth') === 'true'
  );
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === DEFAULT_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('bu_researcher_admin_auth', 'true');
      setAuthError(null);
      setPasswordInput('');
    } else {
      setAuthError('Incorrect admin password. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bu_researcher_admin_auth');
  };

  // Load server submissions automatically when authenticated and panel is open
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchSubmissionsFromServer().then((data) => {
        setSubmissions(data);
      });
    }
  }, [isOpen, isAuthenticated]);

  const handleRefresh = async () => {
    const data = await fetchSubmissionsFromServer();
    setSubmissions(data);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this response locally?')) {
      const updated = deleteSubmissionLocally(id);
      setSubmissions(updated);
    }
  };

  const handleSaveConfig = () => {
    saveStoredConfig(config);
    setTestStatus('Settings saved successfully!');
    setTimeout(() => setTestStatus(null), 3000);
  };

  const handleTestWebhook = async () => {
    setIsTesting(true);
    setTestStatus(null);
    saveStoredConfig(config);

    if (submissions.length === 0) {
      setTestStatus('No stored submissions to test with. Create a dummy test submission first.');
      setIsTesting(false);
      return;
    }

    const res = await syncToGoogleSheets(submissions[0], config.webhookUrl);
    setIsTesting(false);
    setTestStatus(res.message);
  };

  const handleDownloadCSV = () => {
    const csvContent = exportSubmissionsToCSV(submissions);
    if (!csvContent) return;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BU_SME_AI_Screening_Responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubs = submissions.filter((s) => {
    const matchesSearch =
      s.refNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.partB.qB1_firmNameOrPseudonym.toLowerCase().includes(search.toLowerCase()) ||
      s.completedByRole.toLowerCase().includes(search.toLowerCase());

    const isQual = s.qualification.isEligible;
    const matchesQual =
      filterQual === 'ALL' ||
      (filterQual === 'QUALIFIED' && isQual) ||
      (filterQual === 'DISQUALIFIED' && !isQual);

    return matchesSearch && matchesQual;
  });

  const totalCount = submissions.length;
  const qualifiedCount = submissions.filter((s) => s.qualification.isEligible).length;
  const qualRate = totalCount > 0 ? Math.round((qualifiedCount / totalCount) * 100) : 0;

  // Render Password Lock Dialog if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 text-slate-100 relative overflow-hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-sans text-white">
              Researcher Access Sign-In
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              This dashboard is strictly reserved for Bangkok University research administrators to view responses and configure Google Sheets export.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                Enter Researcher Admin Password:
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-500 font-mono"
              />
            </div>

            {authError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Researcher Dashboard</span>
            </button>

            <div className="text-center pt-2 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-500 font-mono">
                Access Protected • Researcher Credentials Required
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100 font-sans">
                Researcher Control Dashboard
              </h3>
              <p className="text-xs text-slate-400">
                Isaac Gon Hkaung (Zack) • Bangkok University MBA-i Research
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Sign Out / Lock Dashboard"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 font-medium block">Total Submissions</span>
              <span className="text-2xl font-bold text-slate-100 font-mono mt-1 block">
                {totalCount}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-emerald-400 font-medium block">Qualified Firms</span>
              <span className="text-2xl font-bold text-emerald-300 font-mono mt-1 block">
                {qualifiedCount}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-purple-400 font-medium block">Qualification Rate</span>
              <span className="text-2xl font-bold text-purple-300 font-mono mt-1 block">
                {qualRate}%
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-indigo-400 font-medium block">Google Sheets Sync</span>
              <span className="text-xs font-bold text-indigo-300 mt-2 block truncate">
                {config.webhookUrl && !config.webhookUrl.includes('EXAMPLE') ? 'Configured' : 'Not Configured'}
              </span>
            </div>
          </div>

          {/* Google Sheets Webhook Configuration Box */}
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-purple-900/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                Google Sheets Webhook Configuration
              </h4>

              <button
                type="button"
                onClick={onOpenGuide}
                className="text-purple-300 hover:text-purple-200 text-xs font-semibold underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                How to set up Apps Script?
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-400 font-medium">Google Apps Script Web App URL:</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  value={config.webhookUrl}
                  onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs font-mono focus:outline-none focus:border-purple-500"
                />

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs border border-slate-700 transition-all cursor-pointer shrink-0"
                >
                  Save URL
                </button>

                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={isTesting}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0"
                >
                  {isTesting ? 'Testing...' : 'Test Webhook'}
                </button>
              </div>

              {testStatus && (
                <p className="text-xs font-mono text-purple-300 bg-purple-950/50 p-2 rounded-lg border border-purple-800/40 mt-2">
                  {testStatus}
                </p>
              )}
            </div>
          </div>

          {/* Submissions Data Table Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-100 text-sm">Collected Responses ({filteredSubs.length})</h4>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title="Refresh local submissions"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search ref or firm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <select
                  value={filterQual}
                  onChange={(e) => setFilterQual(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="ALL">All Eligibility</option>
                  <option value="QUALIFIED">Qualified Only</option>
                  <option value="DISQUALIFIED">Disqualified Only</option>
                </select>

                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  disabled={submissions.length === 0}
                  className="px-3.5 py-1.5 bg-purple-900/60 hover:bg-purple-900 text-purple-200 border border-purple-700 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-900/60">
                    <th className="py-2.5 px-3 font-semibold">Ref Number</th>
                    <th className="py-2.5 px-3 font-semibold">Date</th>
                    <th className="py-2.5 px-3 font-semibold">Firm / Pseudonym</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Role</th>
                    <th className="py-2.5 px-3 font-semibold">Sync</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs">
                  {filteredSubs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                        No responses found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredSubs.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-purple-300">
                          {sub.refNumber}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                          {new Date(sub.completedAt).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-100">
                          {sub.partB.qB1_firmNameOrPseudonym || 'Anonymous Firm'}
                        </td>
                        <td className="py-2.5 px-3">
                          {sub.qualification.isEligible ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              QUALIFIED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                              <XCircle className="w-3 h-3 text-rose-400" />
                              DISQUALIFIED
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {sub.completedByRole}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold ${sub.syncedToGoogleSheets ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {sub.syncedToGoogleSheets ? 'GSheets OK' : 'Local Only'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => setSelectedSub(sub)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sub.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                            title="Delete submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Individual Submission Details Modal Overlay */}
        {selectedSub && (
          <div className="fixed inset-0 z-60 bg-slate-950/90 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl p-6 space-y-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-slate-100 font-serif">
                  Submission Details — {selectedSub.refNumber}
                </h4>
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-4 text-xs">
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-96">
                  {JSON.stringify(selectedSub, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
