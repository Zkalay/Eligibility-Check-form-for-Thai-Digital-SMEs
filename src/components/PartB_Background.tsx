import React from 'react';
import { PartBResponses } from '../types';
import {
  DIGITAL_SERVICE_CATEGORIES,
  OWNERSHIP_STRUCTURES,
  GEOGRAPHIC_MARKETS,
} from '../data/questionnaireData';
import { Building2, ChevronRight, ChevronLeft, Mail, Phone, Building, Globe } from 'lucide-react';

interface PartBProps {
  data: PartBResponses;
  onChange: (updated: Partial<PartBResponses>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PartB_Background: React.FC<PartBProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const toggleOwnership = (item: string) => {
    const current = data.qB6_ownershipStructure || [];
    if (current.includes(item)) {
      onChange({ qB6_ownershipStructure: current.filter((x) => x !== item) });
    } else {
      onChange({ qB6_ownershipStructure: [...current, item] });
    }
  };

  const isComplete =
    (data.qB1_firmNameOrPseudonym || '').trim() !== '' &&
    (data.businessWebsite || '').trim() !== '' &&
    (data.emailAddress || '').trim() !== '' &&
    (data.phoneNumber || '').trim() !== '' &&
    data.qB2_yearEstablished !== '' &&
    data.qB3_employeeCountBand !== '' &&
    data.qB4_revenueBand !== '' &&
    data.qB5_primaryCategory !== '' &&
    data.qB6_ownershipStructure.length > 0 &&
    data.qB7_primaryMarket !== '';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200">
              PART B
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Firm Background & Contact Profile
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            This section collects standardized background information and contact details used to describe the study sample and support cross-case analysis. There are no right or wrong answers.
          </p>
        </div>
      </div>

      {/* B1. Business Name, Website, Email & Phone */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 hover:border-indigo-200 transition-all">
        <div className="space-y-1 border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question B1
          </span>
          <h3 className="text-base font-bold text-slate-800">
            Business & Contact Information
          </h3>
          <p className="text-xs text-slate-500">
            Please provide your business name, company website, primary email address, and contact phone number.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span>Business Name</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Tech Co., Ltd."
              value={data.qB1_firmNameOrPseudonym || ''}
              onChange={(e) =>
                onChange({
                  qB1_firmNameOrPseudonym: e.target.value,
                })
              }
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs font-medium"
            />
          </div>

          {/* Business Website */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>Business Website</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. www.acmetech.com"
              value={data.businessWebsite || ''}
              onChange={(e) =>
                onChange({
                  businessWebsite: e.target.value,
                })
              }
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs font-medium"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Email Address</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. contact@acmetech.com"
              value={data.emailAddress || ''}
              onChange={(e) =>
                onChange({
                  emailAddress: e.target.value,
                })
              }
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs font-medium"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Phone Number</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. 081-234-5678"
              value={data.phoneNumber || ''}
              onChange={(e) =>
                onChange({
                  phoneNumber: e.target.value,
                })
              }
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* B2. Year Established */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question B2
          </span>
          <h3 className="text-base font-bold text-slate-800 flex items-center justify-between">
            <span>
              Year the Firm Was Established <span className="text-rose-500">*</span>
            </span>
            <span className="text-[11px] text-rose-500 font-semibold">Required</span>
          </h3>
          <p className="text-xs text-slate-500">
            Please enter the 4-digit founding year of your firm (e.g. 2018).
          </p>
        </div>

        <div className="max-w-xs">
          <input
            type="number"
            min="1950"
            max="2026"
            placeholder="e.g. 2018"
            value={data.qB2_yearEstablished}
            onChange={(e) => onChange({ qB2_yearEstablished: e.target.value })}
            className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm font-mono font-bold ${
              !data.qB2_yearEstablished
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
            }`}
          />
          {!data.qB2_yearEstablished && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">
              * Firm establishment year is required to continue.
            </p>
          )}
        </div>
      </div>

      {/* B3. Current Number of Full-Time Employees */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question B3
          </span>
          <h3 className="text-base font-bold text-slate-800">
            Current Number of Full-Time Employees <span className="text-xs text-slate-500 font-normal">(select one)</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            '6 – 10 employees',
            '11 – 20 employees',
            '21 – 30 employees',
            '31 – 50 employees',
            '51 – 100 employees',
            'More than 100 employees',
          ].map((band) => (
            <button
              key={band}
              type="button"
              onClick={() => onChange({ qB3_employeeCountBand: band as any })}
              className={`p-3.5 rounded-xl border-2 text-xs font-bold text-left transition-all cursor-pointer ${
                data.qB3_employeeCountBand === band
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              {band}
            </button>
          ))}
        </div>
      </div>

      {/* B4. Approximate Annual Revenue Band */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question B4
          </span>
          <h3 className="text-base font-bold text-slate-800">
            Approximate Annual Revenue Band <span className="text-xs text-slate-500 font-normal">(select one; strictly confidential)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'THB 1.8 million – 10 million',
            'THB 10 million – 50 million',
            'THB 50 million – 100 million',
            'THB 100 million – 300 million',
            'Prefer not to disclose',
          ].map((band) => (
            <button
              key={band}
              type="button"
              onClick={() => onChange({ qB4_revenueBand: band as any })}
              className={`p-3.5 rounded-xl border-2 text-xs font-bold text-left transition-all cursor-pointer ${
                data.qB4_revenueBand === band
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              {band}
            </button>
          ))}
        </div>
      </div>

      {/* B5. Primary Digital Service Category */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question B5
          </span>
          <h3 className="text-base font-bold text-slate-800">
            Primary Digital Service Category <span className="text-xs text-slate-500 font-normal">(select the one that best describes core business)</span>
          </h3>
        </div>

        <div className="space-y-2">
          {DIGITAL_SERVICE_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-xs font-medium cursor-pointer transition-all ${
                data.qB5_primaryCategory === cat
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              <input
                type="radio"
                name="qB5"
                value={cat}
                checked={data.qB5_primaryCategory === cat}
                onChange={() => onChange({ qB5_primaryCategory: cat })}
                className="mt-0.5 accent-indigo-600"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>

        {data.qB5_primaryCategory === 'Other (please specify)' && (
          <div className="pt-2">
            <input
              type="text"
              placeholder="Please specify digital service category..."
              value={data.qB5_otherCategory || ''}
              onChange={(e) => onChange({ qB5_otherCategory: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 font-medium"
            />
          </div>
        )}
      </div>

      {/* B6. Ownership & Management Structure */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question B6
          </span>
          <h3 className="text-base font-bold text-slate-800">
            Ownership and Management Structure <span className="text-xs text-indigo-600 font-semibold">(select all that apply)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OWNERSHIP_STRUCTURES.map((item) => {
            const isChecked = (data.qB6_ownershipStructure || []).includes(item);
            return (
              <label
                key={item}
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-xs font-medium cursor-pointer transition-all ${
                  isChecked
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-sm'
                    : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleOwnership(item)}
                  className="mt-0.5 accent-indigo-600 rounded cursor-pointer"
                />
                <span>{item}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* B7. Primary Geographic Market Served */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Question B7
          </span>
          <h3 className="text-base font-bold text-slate-800">
            Primary Geographic Market Served <span className="text-xs text-slate-500 font-normal">(select one)</span>
          </h3>
        </div>

        <div className="space-y-2">
          {GEOGRAPHIC_MARKETS.map((market) => (
            <label
              key={market}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-xs font-medium cursor-pointer transition-all ${
                data.qB7_primaryMarket === market
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
              }`}
            >
              <input
                type="radio"
                name="qB7"
                value={market}
                checked={data.qB7_primaryMarket === market}
                onChange={() => onChange({ qB7_primaryMarket: market })}
                className="mt-0.5 accent-indigo-600"
              />
              <span>{market}</span>
            </label>
          ))}
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
          <span>Back to Part A</span>
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
          <span>Continue to Part C (AI Profile)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
