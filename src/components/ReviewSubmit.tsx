import React, { useState } from 'react';
import {
  PartAResponses,
  PartBResponses,
  PartCResponses,
  PartDResponses,
  PartEResponses,
  QualificationStatus,
  QuestionnaireSubmission,
} from '../types';
import {
  RESEARCH_METADATA,
} from '../data/questionnaireData';
import {
  syncToGoogleSheets,
  saveSubmissionLocally,
  submitQuestionnaireToServer,
  getStoredConfig,
} from '../utils/googleSheetsSync';
import { generateRefNumber } from '../utils/anonymity';
import {
  CheckCircle2,
  ShieldCheck,
  Send,
  Building2,
  Cpu,
  Brain,
  Sparkles,
  Lock,
  ChevronLeft,
  Loader2,
  ExternalLink,
  Check,
} from 'lucide-react';

interface ReviewSubmitProps {
  respondentId: string;
  isAnonymous: boolean;
  qualification: QualificationStatus;
  partA: PartAResponses;
  partB: PartBResponses;
  partC: PartCResponses;
  partD: PartDResponses;
  partE: PartEResponses;
  onPrev: () => void;
  onSubmittedSuccess: (submission: QuestionnaireSubmission) => void;
}

export const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
  respondentId,
  isAnonymous,
  qualification,
  partA,
  partB,
  partC,
  partD,
  partE,
  onPrev,
  onSubmittedSuccess,
}) => {
  const [completedByRole, setCompletedByRole] = useState('');
  const [pdpaConsent, setPdpaConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    sub?: QuestionnaireSubmission;
  } | null>(null);

  const handleFinalSubmit = async () => {
    if (!pdpaConsent) return;

    setIsSubmitting(true);
    const refNumber = generateRefNumber();
    const config = getStoredConfig();

    const submission: QuestionnaireSubmission = {
      id: `SUB-${Date.now()}`,
      refNumber,
      completedAt: new Date().toISOString(),
      completedByRole,
      respondentIdentifier: respondentId,
      isAnonymous,
      pdpaConsent,
      qualification,
      partA,
      partB,
      partC,
      partD,
      partE,
      syncedToGoogleSheets: false,
    };

    // Submit to server & Google Sheets
    const submitRes = await submitQuestionnaireToServer(submission, config.webhookUrl);

    setIsSubmitting(false);

    const finalResult = {
      success: true,
      message: submitRes.message,
      sub: submission,
    };

    setSubmissionResult(finalResult);
    onSubmittedSuccess(submission);
  };

  if (submissionResult?.success && submissionResult.sub) {
    return (
      <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto py-6">
        <div className="bg-white border border-emerald-200 rounded-3xl p-8 text-center space-y-6 shadow-md relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Submission Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
              Thank You for Completing the Screening Questionnaire!
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Your questionnaire responses have been securely logged for the Bangkok University research study on AI-driven business model innovation in Thai SMEs.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 space-y-4 max-w-lg mx-auto text-left text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Questionnaire Reference No:</span>
              <span className="font-mono font-bold text-indigo-700">{submissionResult.sub.refNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Research Identifier:</span>
              <span className="font-mono font-bold text-slate-800">{submissionResult.sub.respondentIdentifier}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Qualification Status:</span>
              <span className="font-bold text-emerald-600">QUALIFIED</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">Submission Status:</span>
              <span className="text-emerald-600 font-bold">
                Logged & Confirmed
              </span>
            </div>
          </div>

          {/* Next Steps Info */}
          <div className="p-5 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-slate-700 text-left space-y-2">
            <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              What Happens Next?
            </h4>
            <p className="leading-relaxed text-slate-600">
              Your responses will be reviewed within 2–3 business days. If your firm meets all eligibility criteria and you are willing to participate, researcher <strong className="text-indigo-900">Isaac Gon Hkaung (Zack)</strong> will contact you to schedule a 90–120 minute semi-structured interview at a time convenient for you.
            </p>
            <p className="text-slate-500 pt-1 font-medium">
              Direct Contact: <a href={`mailto:${RESEARCH_METADATA.researcherEmail}`} className="text-indigo-600 underline font-mono">{RESEARCH_METADATA.researcherEmail}</a> | {RESEARCH_METADATA.researcherPhone}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Submit Another Response / Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 text-indigo-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200">
                FINAL REVIEW
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Review & Submit Questionnaire
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Please review your summary below before dispatching the completed questionnaire. All responses are confidential under Bangkok University ethics guidelines and PDPA B.E. 2562.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Part A & B Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Eligibility, Firm & Contact Details
          </h3>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Eligibility Result:</span>
              <span className="font-bold text-emerald-600">QUALIFIED</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Business Name:</span>
              <span className="font-bold text-slate-900">{partB.qB1_firmNameOrPseudonym || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Business Website:</span>
              <span className="font-semibold text-indigo-700">{partB.businessWebsite || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Email Address:</span>
              <span className="font-semibold text-indigo-700">{partB.emailAddress || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Phone Number:</span>
              <span className="font-semibold text-slate-800">{partB.phoneNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Established Year:</span>
              <span className="font-mono font-semibold text-slate-800">{partB.qB2_yearEstablished}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Employees Band:</span>
              <span className="text-slate-800 font-medium">{partB.qB3_employeeCountBand}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Revenue Band:</span>
              <span className="text-slate-800 font-medium">{partB.qB4_revenueBand}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Primary Digital Category:</span>
              <span className="text-slate-800 font-medium text-right max-w-[200px] truncate">{partB.qB5_primaryCategory}</span>
            </div>
          </div>
        </div>

        {/* Part C Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-indigo-600" />
            AI Application Profile
          </h3>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">AI Usage Duration:</span>
              <span className="font-bold text-indigo-700">{partC.qC1_aiUsageDuration}</span>
            </div>
            <div className="py-1 border-b border-slate-100">
              <span className="text-slate-500 block mb-1">AI Tools Used ({(partC.qC2_aiApplicationTypes || []).length}):</span>
              <div className="flex flex-wrap gap-1">
                {(partC.qC2_aiApplicationTypes || []).slice(0, 3).map((t, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-medium">
                    {t.split('(')[0]}
                  </span>
                ))}
                {(partC.qC2_aiApplicationTypes || []).length > 3 && (
                  <span className="text-[10px] text-slate-500">+{partC.qC2_aiApplicationTypes.length - 3} more</span>
                )}
              </div>
            </div>
            <div className="py-1">
              <span className="text-slate-500 block mb-1">Core Functional Areas:</span>
              <div className="flex flex-wrap gap-1">
                {(partC.qC3_functionalAreas || []).map((f, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] border border-indigo-200 font-bold">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part D & E Scores Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
          <Brain className="w-4 h-4 text-indigo-600" />
          Absorptive Capacity (ACAP) & Business Model Innovation (BMI) Scores
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-center text-xs">
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-medium">D1 Acquisition</span>
            <span className="font-bold text-indigo-700 text-lg">{partD.qD1_knowledgeAcquisition}</span>
          </div>
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-medium">D2 Assimilation</span>
            <span className="font-bold text-indigo-700 text-lg">{partD.qD2_knowledgeAssimilation}</span>
          </div>
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-medium">D3 Transformation</span>
            <span className="font-bold text-indigo-700 text-lg">{partD.qD3_knowledgeTransformation}</span>
          </div>
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-medium">D4 Exploitation</span>
            <span className="font-bold text-indigo-700 text-lg">{partD.qD4_knowledgeExploitation}</span>
          </div>
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-medium">E1 Value Prop</span>
            <span className="font-bold text-indigo-700 text-lg">{partE.qE1_valueProposition}</span>
          </div>
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-medium">E3 Revenue Model</span>
            <span className="font-bold text-indigo-700 text-lg">{partE.qE3_revenueModel}</span>
          </div>
        </div>
      </div>

      {/* Respondent Role & Final Consent Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          Respondent Declaration & Ethics Consent
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
              <span>
                Completed By (Role / Position): <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-rose-500 font-semibold">Required</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Chief Executive Officer / Founder / Head of Innovation"
              value={completedByRole}
              onChange={(e) => setCompletedByRole(e.target.value)}
              className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-900 text-xs focus:outline-none focus:ring-2 font-medium ${
                !completedByRole.trim()
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
              }`}
            />
            {!completedByRole.trim() && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                * Please enter your role or position in the firm to submit.
              </p>
            )}
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 cursor-pointer">
            <input
              type="checkbox"
              checked={pdpaConsent}
              onChange={(e) => setPdpaConsent(e.target.checked)}
              className="mt-0.5 accent-indigo-600 rounded cursor-pointer"
            />
            <span className="text-slate-700 leading-relaxed font-medium">
              I confirm that I have read the introduction to this questionnaire. I understand that all information provided will be kept strictly confidential, reported only in aggregated or anonymized form in accordance with the <strong>Personal Data Protection Act (PDPA B.E. 2562)</strong> and Bangkok University research ethics guidelines.
            </span>
          </label>
        </div>
      </div>

      {/* Dispatch Controls */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm inline-flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="leading-none">Back to Part E</span>
        </button>

        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={!pdpaConsent || isSubmitting || !completedByRole.trim()}
          className={`px-8 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg ${
            pdpaConsent && completedByRole.trim() && !isSubmitting
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              : 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="inline-flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
              <span className="leading-none">Submitting Questionnaire...</span>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center gap-2">
              <Send className="w-4 h-4 text-indigo-100 shrink-0" />
              <span className="leading-none">Submit</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
