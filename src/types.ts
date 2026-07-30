export interface QualificationStatus {
  isEligible: boolean;
  failedCriteria: Array<{
    code: 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6';
    title: string;
    reason: string;
  }>;
  summaryNote: string;
}

export interface PartAResponses {
  qA1_thailandRegistered: 'Yes' | 'No' | '';
  qA2_firmSize: 'Small' | 'Medium' | 'Micro' | 'Exceeds' | 'Unsure' | '';
  qA2_unsure_employees?: string;
  qA2_unsure_revenue?: string;
  qA3_digitalServiceRevenue: 'Yes' | 'Partially' | 'No' | '';
  qA4_aiImplementationStage:
    | 'considering_planning'
    | 'pilots_experiments'
    | 'regular_use_one_area'
    | 'integrated_several_processes'
    | 'central_value_creation'
    | '';
  qA5_informantRole: 'Yes_Self' | 'Yes_Referral' | 'No' | '';
  qA5_referralDetails?: string;
  qA6_operatingHistory: 'Yes' | 'No' | '';
}

export interface PartBResponses {
  qB1_firmNameOrPseudonym: string; // Business Name
  businessWebsite: string; // Business Website (Required)
  emailAddress: string;
  phoneNumber: string;
  isPseudonymUsed?: boolean;
  qB2_yearEstablished: string;
  qB3_employeeCountBand:
    | '6-10 employees'
    | '11-20 employees'
    | '21-30 employees'
    | '31-50 employees'
    | '51-100 employees'
    | 'More than 100 employees'
    | '';
  qB4_revenueBand:
    | 'THB 1.8 million – 10 million'
    | 'THB 10 million – 50 million'
    | 'THB 50 million – 100 million'
    | 'THB 100 million – 300 million'
    | 'Prefer not to disclose'
    | '';
  qB5_primaryCategory: string;
  qB5_otherCategory?: string;
  qB6_ownershipStructure: string[];
  qB6_otherOwnership?: string;
  qB7_primaryMarket: string;
}

export interface PartCResponses {
  qC1_aiUsageDuration:
    | 'Less than 1 year'
    | '1 – 2 years'
    | '2 – 4 years'
    | 'More than 4 years'
    | '';
  qC2_aiApplicationTypes: string[];
  qC2_otherAiType?: string;
  qC3_functionalAreas: string[]; // max 3
  qC3_otherArea?: string;
  qC4_integrationDepth:
    | 'one_two_tasks'
    | 'several_processes'
    | 'multiple_core_functions'
    | 'central_business_model'
    | '';
  qC5_shapingFactors: {
    internalDataQuality: number; // 1-5
    skillsKnowledge: number; // 1-5
    financialResources: number; // 1-5
    externalExpertise: number; // 1-5
    institutionalSupport: number; // 1-5
  };
}

export interface PartDResponses {
  qD1_knowledgeAcquisition: number; // 1-5
  qD2_knowledgeAssimilation: number; // 1-5
  qD3_knowledgeTransformation: number; // 1-5
  qD4_knowledgeExploitation: number; // 1-5
  qD5_potentialRealizedGap: number; // 1-5
  qD6_reverseAssimilation: number; // 1-5
}

export interface PartEResponses {
  qE1_valueProposition: number; // 1-5
  qE2_valueCreationArchitecture: number; // 1-5
  qE3_revenueModel: number; // 1-5
  qE4_overallDepthChange: number; // 1-5
  qE5_explorationVsExploitation: number; // 1-5
}

export interface QuestionnaireSubmission {
  id: string;
  refNumber: string;
  completedAt: string;
  completedByRole: string;
  respondentIdentifier: string; // Anonymous ID e.g. TH-AI-2026-X892
  isAnonymous: boolean;
  pdpaConsent: boolean;
  qualification: QualificationStatus;
  partA: PartAResponses;
  partB: PartBResponses;
  partC: PartCResponses;
  partD: PartDResponses;
  partE: PartEResponses;
  syncedToGoogleSheets: boolean;
  syncTimestamp?: string;
}

export interface GoogleSheetsConfig {
  webhookUrl: string;
  sheetName: string;
  autoSync: boolean;
}
