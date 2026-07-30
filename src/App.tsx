import React, { useState, useEffect } from 'react';
import {
  PartAResponses,
  PartBResponses,
  PartCResponses,
  PartDResponses,
  PartEResponses,
  QuestionnaireSubmission,
} from './types';
import { RESEARCH_METADATA } from './data/questionnaireData';
import { evaluateEligibility } from './utils/qualificationEngine';
import { generateResearchId, generateRefNumber } from './utils/anonymity';
import { getStoredSubmissions, saveSubmissionLocally } from './utils/googleSheetsSync';

import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { PartA_Eligibility } from './components/PartA_Eligibility';
import { PartB_Background } from './components/PartB_Background';
import { PartC_AIProfile } from './components/PartC_AIProfile';
import { PartD_ACAP } from './components/PartD_ACAP';
import { PartE_BMI } from './components/PartE_BMI';
import { ReviewSubmit } from './components/ReviewSubmit';
import { DisqualifiedNotice } from './components/DisqualifiedNotice';
import { AdminPanel } from './components/AdminPanel';
import { GoogleSheetsGuideModal } from './components/GoogleSheetsGuideModal';

const DRAFT_STORAGE_KEY = 'bu_sme_ai_draft_v1';

export default function App() {
  const [respondentId] = useState<string>(() => generateResearchId());
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showDisqualifiedNotice, setShowDisqualifiedNotice] = useState<boolean>(false);

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [storedCount, setStoredCount] = useState<number>(() => getStoredSubmissions().length);

  // Scroll to top automatically when changing section
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, showDisqualifiedNotice]);

  // Initial State for Part A
  const [partA, setPartA] = useState<PartAResponses>({
    qA1_thailandRegistered: '',
    qA2_firmSize: '',
    qA3_digitalServiceRevenue: '',
    qA4_aiImplementationStage: '',
    qA5_informantRole: '',
    qA6_operatingHistory: '',
  });

  // Initial State for Part B
  const [partB, setPartB] = useState<PartBResponses>({
    qB1_firmNameOrPseudonym: '',
    businessWebsite: '',
    emailAddress: '',
    phoneNumber: '',
    isPseudonymUsed: false,
    qB2_yearEstablished: '',
    qB3_employeeCountBand: '',
    qB4_revenueBand: '',
    qB5_primaryCategory: '',
    qB6_ownershipStructure: [],
    qB7_primaryMarket: '',
  });

  // Initial State for Part C
  const [partC, setPartC] = useState<PartCResponses>({
    qC1_aiUsageDuration: '',
    qC2_aiApplicationTypes: [],
    qC3_functionalAreas: [],
    qC4_integrationDepth: '',
    qC5_shapingFactors: {
      internalDataQuality: 0,
      skillsKnowledge: 0,
      financialResources: 0,
      externalExpertise: 0,
      institutionalSupport: 0,
    },
  });

  // Initial State for Part D
  const [partD, setPartD] = useState<PartDResponses>({
    qD1_knowledgeAcquisition: 0,
    qD2_knowledgeAssimilation: 0,
    qD3_knowledgeTransformation: 0,
    qD4_knowledgeExploitation: 0,
    qD5_potentialRealizedGap: 0,
    qD6_reverseAssimilation: 0,
  });

  // Initial State for Part E
  const [partE, setPartE] = useState<PartEResponses>({
    qE1_valueProposition: 0,
    qE2_valueCreationArchitecture: 0,
    qE3_revenueModel: 0,
    qE4_overallDepthChange: 0,
    qE5_explorationVsExploitation: 0,
  });

  // Dynamic Qualification Engine Evaluation
  const qualification = evaluateEligibility(partA);

  const isPartAFilled =
    partA.qA1_thailandRegistered !== '' &&
    partA.qA2_firmSize !== '' &&
    partA.qA3_digitalServiceRevenue !== '' &&
    partA.qA4_aiImplementationStage !== '' &&
    partA.qA5_informantRole !== '' &&
    partA.qA6_operatingHistory !== '';

  // Handle Proceed from Part A
  const handleProceedFromPartA = () => {
    if (!qualification.isEligible) {
      setShowDisqualifiedNotice(true);
    } else {
      setShowDisqualifiedNotice(false);
      setCurrentStep(2);
    }
  };

  const handleSaveIneligibleRecord = () => {
    const sub: QuestionnaireSubmission = {
      id: `DISQUAL-${Date.now()}`,
      refNumber: generateRefNumber(),
      completedAt: new Date().toISOString(),
      completedByRole: 'Ineligible Applicant',
      respondentIdentifier: respondentId,
      isAnonymous,
      pdpaConsent: true,
      qualification,
      partA,
      partB,
      partC,
      partD,
      partE,
      syncedToGoogleSheets: false,
    };
    saveSubmissionLocally(sub);
    setStoredCount(getStoredSubmissions().length);
    alert('Anonymized ineligible response logged for methodology statistics. Thank you!');
  };

  const handleSubmittedSuccess = () => {
    setStoredCount(getStoredSubmissions().length);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <Header
        respondentId={respondentId}
        isAnonymous={isAnonymous}
        setIsAnonymous={setIsAnonymous}
        onOpenAdmin={() => setIsAdminOpen(true)}
        storedSubmissionsCount={storedCount}
      />

      {/* Progress Bar */}
      {!showDisqualifiedNotice && (
        <ProgressBar
          currentStep={currentStep}
          onStepClick={(stepId) => setCurrentStep(stepId)}
          isEligible={qualification.isEligible}
          partACompleted={isPartAFilled}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {showDisqualifiedNotice ? (
          <DisqualifiedNotice
            qualification={qualification}
            partA={partA}
            onEditPartA={() => setShowDisqualifiedNotice(false)}
            onSaveIneligibleRecord={handleSaveIneligibleRecord}
          />
        ) : (
          <>
            {currentStep === 1 && (
              <PartA_Eligibility
                data={partA}
                onChange={(up) => setPartA((prev) => ({ ...prev, ...up }))}
                onProceed={handleProceedFromPartA}
                isEligible={qualification.isEligible}
                isEvaluated={isPartAFilled}
                failedCount={qualification.failedCriteria.length}
              />
            )}

            {currentStep === 2 && (
              <PartB_Background
                data={partB}
                onChange={(up) => setPartB((prev) => ({ ...prev, ...up }))}
                onNext={() => setCurrentStep(3)}
                onPrev={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <PartC_AIProfile
                data={partC}
                onChange={(up) => setPartC((prev) => ({ ...prev, ...up }))}
                onNext={() => setCurrentStep(4)}
                onPrev={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <PartD_ACAP
                data={partD}
                onChange={(up) => setPartD((prev) => ({ ...prev, ...up }))}
                onNext={() => setCurrentStep(5)}
                onPrev={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 5 && (
              <PartE_BMI
                data={partE}
                onChange={(up) => setPartE((prev) => ({ ...prev, ...up }))}
                onNext={() => setCurrentStep(6)}
                onPrev={() => setCurrentStep(4)}
              />
            )}

            {currentStep === 6 && (
              <ReviewSubmit
                respondentId={respondentId}
                isAnonymous={isAnonymous}
                qualification={qualification}
                partA={partA}
                partB={partB}
                partC={partC}
                partD={partD}
                partE={partE}
                onPrev={() => setCurrentStep(5)}
                onSubmittedSuccess={handleSubmittedSuccess}
              />
            )}
          </>
        )}
      </main>

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Google Sheets Guide Modal */}
      <GoogleSheetsGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
