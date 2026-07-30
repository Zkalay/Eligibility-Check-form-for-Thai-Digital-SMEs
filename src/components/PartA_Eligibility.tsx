import React from 'react';
import { PartAResponses } from '../types';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building2,
  Users,
  Briefcase,
  Cpu,
  UserCheck,
  Calendar,
  ChevronRight,
  Info,
} from 'lucide-react';

interface PartAProps {
  data: PartAResponses;
  onChange: (updated: Partial<PartAResponses>) => void;
  onProceed: () => void;
  isEligible: boolean;
  isEvaluated: boolean;
  failedCount: number;
}

export const PartA_Eligibility: React.FC<PartAProps> = ({
  data,
  onChange,
  onProceed,
  isEligible,
  isEvaluated,
  failedCount,
}) => {
  const isFormFilled =
    data.qA1_thailandRegistered !== '' &&
    data.qA2_firmSize !== '' &&
    data.qA3_digitalServiceRevenue !== '' &&
    data.qA4_aiImplementationStage !== '' &&
    data.qA5_informantRole !== '' &&
    data.qA6_operatingHistory !== '';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 text-indigo-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200">
                PART A
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Eligibility Screening (Inclusion Criteria)
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              This section confirms whether your firm meets the research study's inclusion criteria.
              Please answer each question accurately. If your firm qualifies, you will proceed directly to the background questionnaire.
            </p>
          </div>
        </div>
      </div>

      {/* Question A1 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Question A1
            </span>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
              Firm Registration and Location
            </h3>
            <p className="text-sm text-slate-600">
              Is your firm registered and primarily operating in Thailand?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            {
              value: 'Yes',
              label: 'Yes — Registered & operating in Thailand',
              sub: 'Meets criterion A1',
              eligible: true,
            },
            {
              value: 'No',
              label: 'No — Operating outside Thailand',
              sub: 'Study focuses strictly on Thai digital service firms',
              eligible: false,
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-sm cursor-pointer transition-all ${
                data.qA1_thailandRegistered === option.value
                  ? option.eligible
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold shadow-sm'
                    : 'border-rose-600 bg-rose-50 text-rose-950 font-semibold shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              <input
                type="radio"
                name="qA1"
                value={option.value}
                checked={data.qA1_thailandRegistered === option.value}
                onChange={() => onChange({ qA1_thailandRegistered: option.value as 'Yes' | 'No' })}
                className="mt-0.5 accent-indigo-600"
              />
              <div className="space-y-0.5">
                <p className="font-medium leading-snug">{option.label}</p>
                <p className="text-xs opacity-80">{option.sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Question A2 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question A2
          </span>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600 shrink-0" />
            Firm Size — OSMEP Service-Sector Criteria (post-November 2019)
          </h3>
          <p className="text-sm text-slate-600">
            Under the Office of SMEs Promotion (OSMEP) current definition, a Thai service enterprise is classified as:
          </p>
        </div>

        {/* OSMEP Criteria Reference Table */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs overflow-x-auto">
          <p className="font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            OSMEP Service & Trading Classification Thresholds:
          </p>
          <table className="w-full text-left border-collapse min-w-[400px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 px-3 font-semibold">Classification</th>
                <th className="py-2 px-3 font-semibold">Full-Time Employees</th>
                <th className="py-2 px-3 font-semibold">Annual Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 text-slate-700">
              <tr>
                <td className="py-2 px-3 font-semibold text-indigo-700">Small Enterprise</td>
                <td className="py-2 px-3">6 – 30 employees</td>
                <td className="py-2 px-3">&gt; THB 1.8M and up to THB 50M</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-indigo-700">Medium Enterprise</td>
                <td className="py-2 px-3">31 – 100 employees</td>
                <td className="py-2 px-3">&gt; THB 50M and up to THB 300M</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm font-semibold text-slate-800 pt-1">
          Does your firm fall within the Small or Medium Enterprise range in the services sector?
        </p>

        <div className="space-y-2.5">
          {[
            {
              value: 'Small',
              label: 'Yes — Small Enterprise (6–30 employees; revenue THB 1.8M – 50M)',
              sub: 'Qualifies under Small Enterprise range',
            },
            {
              value: 'Medium',
              label: 'Yes — Medium Enterprise (31–100 employees; revenue THB 50M – 300M)',
              sub: 'Qualifies under Medium Enterprise range',
            },
            {
              value: 'Micro',
              label: 'No — Microenterprise (1–5 employees or revenue below THB 1.8M)',
              sub: 'Outside study scope (focuses on Small and Medium firms)',
            },
            {
              value: 'Exceeds',
              label: 'No — Exceeds SME threshold (> 100 employees or revenue above THB 300M)',
              sub: 'Outside study scope (exceeds SME criteria)',
            },
            {
              value: 'Unsure',
              label: 'Unsure — Require estimation',
              sub: 'Please specify estimated full-time employee count and revenue band below',
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-sm cursor-pointer transition-all ${
                data.qA2_firmSize === option.value
                  ? option.value === 'Small' || option.value === 'Medium' || option.value === 'Unsure'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold shadow-sm'
                    : 'border-rose-600 bg-rose-50 text-rose-950 font-semibold shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              <input
                type="radio"
                name="qA2"
                value={option.value}
                checked={data.qA2_firmSize === option.value}
                onChange={() => onChange({ qA2_firmSize: option.value as any })}
                className="mt-0.5 accent-indigo-600"
              />
              <div className="space-y-0.5">
                <p className="font-medium leading-snug">{option.label}</p>
                <p className="text-xs opacity-80">{option.sub}</p>
              </div>
            </label>
          ))}
        </div>

        {data.qA2_firmSize === 'Unsure' && (
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-3 text-xs">
            <p className="font-bold text-indigo-900">Please provide your best estimates:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Approx. Full-time Employees:</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={data.qA2_unsure_employees || ''}
                  onChange={(e) => onChange({ qA2_unsure_employees: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Approx. Annual Revenue (THB):</label>
                <input
                  type="text"
                  placeholder="e.g. 25,000,000"
                  value={data.qA2_unsure_revenue || ''}
                  onChange={(e) => onChange({ qA2_unsure_revenue: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Question A3 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question A3
          </span>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
            Core Business Type — Digital Service Definition
          </h3>
          <p className="text-sm text-slate-600">
            This study focuses on Thai SMEs whose core value creation activities are delivered through digital technologies (e.g. digital agencies, software dev, FinTech, data analytics, IT consulting).
          </p>
        </div>

        <p className="text-sm font-semibold text-slate-800">
          Does your firm primarily generate revenue from digital services?
        </p>

        <div className="space-y-2.5">
          {[
            {
              value: 'Yes',
              label: 'Yes — Digital services account for the majority of our revenue',
              sub: 'Qualifies as primary digital service provider',
            },
            {
              value: 'Partially',
              label: 'Partially — Digital services account for more than 50% of our revenue',
              sub: 'Qualifies under digital service criteria',
            },
            {
              value: 'No',
              label: 'No — Core business is primarily hardware, manufacturing, traditional retail, or non-digital consulting',
              sub: 'Outside study scope (scoped strictly to digital service firms)',
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-sm cursor-pointer transition-all ${
                data.qA3_digitalServiceRevenue === option.value
                  ? option.value !== 'No'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold shadow-sm'
                    : 'border-rose-600 bg-rose-50 text-rose-950 font-semibold shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              <input
                type="radio"
                name="qA3"
                value={option.value}
                checked={data.qA3_digitalServiceRevenue === option.value}
                onChange={() => onChange({ qA3_digitalServiceRevenue: option.value as any })}
                className="mt-0.5 accent-indigo-600"
              />
              <div className="space-y-0.5">
                <p className="font-medium leading-snug">{option.label}</p>
                <p className="text-xs opacity-80">{option.sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Question A4 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question A4
          </span>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
            AI Use — Implementation Stage
          </h3>
          <p className="text-sm text-slate-600">
            This study focuses on firms that have moved beyond initial planning or piloting and have at least one AI application implemented and actively used in regular operations or service delivery.
          </p>
        </div>

        <p className="text-sm font-semibold text-slate-800">
          Which of the following best describes your firm's current AI use?
        </p>

        <div className="space-y-2.5">
          {[
            {
              value: 'considering_planning',
              label: 'Considering or planning AI adoption, but have not yet implemented anything',
              sub: 'Disqualifies (requires implemented AI)',
              eligible: false,
            },
            {
              value: 'pilots_experiments',
              label: 'Run one or more AI pilots or experiments, but AI is not yet embedded in regular operations',
              sub: 'Disqualifies (requires AI beyond pilot stage)',
              eligible: false,
            },
            {
              value: 'regular_use_one_area',
              label: 'Use AI regularly in at least one area of our operations or service delivery',
              sub: 'Qualifies (regular operational AI use)',
              eligible: true,
            },
            {
              value: 'integrated_several_processes',
              label: 'AI is integrated across several core processes in our firm',
              sub: 'Qualifies (integrated AI processes)',
              eligible: true,
            },
            {
              value: 'central_value_creation',
              label: 'AI is central to how we create and deliver value to clients',
              sub: 'Qualifies (strategic AI core)',
              eligible: true,
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-sm cursor-pointer transition-all ${
                data.qA4_aiImplementationStage === option.value
                  ? option.eligible
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold shadow-sm'
                    : 'border-rose-600 bg-rose-50 text-rose-950 font-semibold shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              <input
                type="radio"
                name="qA4"
                value={option.value}
                checked={data.qA4_aiImplementationStage === option.value}
                onChange={() => onChange({ qA4_aiImplementationStage: option.value as any })}
                className="mt-0.5 accent-indigo-600"
              />
              <div className="space-y-0.5">
                <p className="font-medium leading-snug">{option.label}</p>
                <p className="text-xs opacity-80">{option.sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Question A5 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question A5
          </span>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            Informant Role
          </h3>
          <p className="text-sm text-slate-600">
            This study requires that the interview participant be an owner-manager, founder, co-founder, or senior decision-maker (e.g. CEO, MD, Head of Innovation) directly involved in AI decisions.
          </p>
        </div>

        <p className="text-sm font-semibold text-slate-800">
          Are you, or can you identify, such a person who would be willing to participate in a 60–90 minute interview?
        </p>

        <div className="space-y-2.5">
          {[
            {
              value: 'Yes_Self',
              label: 'Yes — I am that person (Senior decision-maker / Founder)',
              sub: 'Qualifies as primary informant',
              eligible: true,
            },
            {
              value: 'Yes_Referral',
              label: 'Yes — I can refer you to the appropriate person',
              sub: 'Please provide contact details below',
              eligible: true,
            },
            {
              value: 'No',
              label: 'No — We do not have a suitable informant available at this time',
              sub: 'Disqualifies (requires senior decision-maker participation)',
              eligible: false,
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-sm cursor-pointer transition-all ${
                data.qA5_informantRole === option.value
                  ? option.eligible
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold shadow-sm'
                    : 'border-rose-600 bg-rose-50 text-rose-950 font-semibold shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              <input
                type="radio"
                name="qA5"
                value={option.value}
                checked={data.qA5_informantRole === option.value}
                onChange={() => onChange({ qA5_informantRole: option.value as any })}
                className="mt-0.5 accent-indigo-600"
              />
              <div className="space-y-0.5">
                <p className="font-medium leading-snug">{option.label}</p>
                <p className="text-xs opacity-80">{option.sub}</p>
              </div>
            </label>
          ))}
        </div>

        {data.qA5_informantRole === 'Yes_Referral' && (
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-2 text-xs">
            <label className="block font-bold text-indigo-900">Referral Name & Contact Info (Email / Phone / LinkedIn):</label>
            <input
              type="text"
              placeholder="e.g., Khun Somchai (CEO) - somchai@company.co.th"
              value={data.qA5_referralDetails || ''}
              onChange={(e) => onChange({ qA5_referralDetails: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Question A6 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question A6
          </span>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            Firm Operating History
          </h3>
          <p className="text-sm text-slate-600">
            Has your firm been in operation for at least 2 years?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {[
            {
              value: 'Yes',
              label: 'Yes — Operating for 2 years or longer',
              sub: 'Meets operating history criterion',
              eligible: true,
            },
            {
              value: 'No',
              label: 'No — Operating for less than 2 years',
              sub: 'Study requires sufficient history to reflect on AI integration over time',
              eligible: false,
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-sm cursor-pointer transition-all ${
                data.qA6_operatingHistory === option.value
                  ? option.eligible
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold shadow-sm'
                    : 'border-rose-600 bg-rose-50 text-rose-950 font-semibold shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              <input
                type="radio"
                name="qA6"
                value={option.value}
                checked={data.qA6_operatingHistory === option.value}
                onChange={() => onChange({ qA6_operatingHistory: option.value as 'Yes' | 'No' })}
                className="mt-0.5 accent-indigo-600"
              />
              <div className="space-y-0.5">
                <p className="font-medium leading-snug">{option.label}</p>
                <p className="text-xs opacity-80">{option.sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Real-time Eligibility Status Banner */}
      {isEvaluated && (
        <div
          className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md transition-all ${
            isEligible
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {isEligible ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="font-bold text-base">
                {isEligible
                  ? 'Eligible Participant Confirmed!'
                  : `Does Not Meet Study Inclusion Criteria (${failedCount} issue${failedCount > 1 ? 's' : ''})`}
              </h4>
              <p className="text-xs opacity-90 leading-relaxed">
                {isEligible
                  ? 'Your firm meets all 6 criteria for the Bangkok University SME AI Research study. You may now continue to Part B.'
                  : 'Thank you for your response. Based on your answers, your firm does not currently match the specific sample requirements for this study stage.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onProceed}
            disabled={!isFormFilled}
            className={`px-8 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-lg shrink-0 transition-all cursor-pointer ${
              isEligible
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            <span>{isEligible ? 'Continue to Part B (Background)' : 'View Screening Feedback'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
