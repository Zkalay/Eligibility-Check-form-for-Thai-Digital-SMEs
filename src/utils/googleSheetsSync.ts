import { GoogleSheetsConfig, QuestionnaireSubmission } from '../types';
import { DEFAULT_GOOGLE_SHEETS_CONFIG } from '../data/defaultConfig';

const STORAGE_KEY = 'bu_sme_ai_submissions';
const CONFIG_KEY = 'bu_sme_ai_gsheets_config';

export function getStoredConfig(): GoogleSheetsConfig {
  const envUrl = (import.meta as any).env?.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';
  const fallbackUrl = DEFAULT_GOOGLE_SHEETS_CONFIG.webhookUrl || '';
  const defaultUrl = envUrl || fallbackUrl;

  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.webhookUrl && !parsed.webhookUrl.includes('EXAMPLE')) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse Google Sheets config', e);
  }
  return {
    webhookUrl: defaultUrl,
    sheetName: DEFAULT_GOOGLE_SHEETS_CONFIG.sheetName || 'Screening Responses',
    autoSync: DEFAULT_GOOGLE_SHEETS_CONFIG.autoSync !== false,
  };
}

export function saveStoredConfig(config: GoogleSheetsConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    // Also save to server API
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to save Google Sheets config', e);
  }
}

export function getStoredSubmissions(): QuestionnaireSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored submissions', e);
  }
  return [];
}

export async function fetchSubmissionsFromServer(): Promise<QuestionnaireSubmission[]> {
  try {
    const res = await fetch('/api/submissions');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.submissions)) {
        const local = getStoredSubmissions();
        const map = new Map<string, QuestionnaireSubmission>();
        local.forEach((s) => map.set(s.id, s));
        data.submissions.forEach((s: QuestionnaireSubmission) => map.set(s.id, s));
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {}
        return merged;
      }
    }
  } catch (e) {
    console.warn('[Sync] /api/submissions endpoint offline or unreachable, using local storage.');
  }
  return getStoredSubmissions();
}

export function saveSubmissionLocally(submission: QuestionnaireSubmission): QuestionnaireSubmission[] {
  const current = getStoredSubmissions();
  const updated = [submission, ...current.filter((s) => s.id !== submission.id)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to store submission in localStorage', e);
  }
  return updated;
}

export async function fetchServerConfig(): Promise<GoogleSheetsConfig> {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.config && data.config.webhookUrl && !data.config.webhookUrl.includes('EXAMPLE')) {
        const config: GoogleSheetsConfig = {
          webhookUrl: data.config.webhookUrl,
          sheetName: data.config.sheetName || 'Screening Responses',
          autoSync: data.config.autoSync !== false,
        };
        try {
          localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch (e) {}
        return config;
      }
    }
  } catch (e) {
    console.warn('[Sync] /api/config fetch failed:', e);
  }
  return getStoredConfig();
}

export async function submitQuestionnaireToServer(
  submission: QuestionnaireSubmission,
  providedWebhookUrl?: string
): Promise<{ success: boolean; syncedToSheets: boolean; message: string }> {
  // 1. Save locally in browser
  saveSubmissionLocally(submission);

  // 2. Resolve webhook URL: use provided, stored, or fallback to default
  let activeWebhookUrl = providedWebhookUrl || getStoredConfig().webhookUrl;
  if (!activeWebhookUrl || activeWebhookUrl.includes('EXAMPLE')) {
    const serverConfig = await fetchServerConfig();
    if (serverConfig.webhookUrl && !serverConfig.webhookUrl.includes('EXAMPLE')) {
      activeWebhookUrl = serverConfig.webhookUrl;
    }
  }

  let isSynced = Boolean(submission.syncedToGoogleSheets);
  let apiMessage = '';

  // 3. Dispatch directly from browser to Google Sheets (using the exact same logic as Webtest Button)
  if (!isSynced && activeWebhookUrl && !activeWebhookUrl.includes('EXAMPLE')) {
    try {
      const directRes = await syncToGoogleSheets(submission, activeWebhookUrl);
      if (directRes.success) {
        isSynced = true;
        submission.syncedToGoogleSheets = true;
        submission.syncTimestamp = new Date().toISOString();
        saveSubmissionLocally(submission);
        apiMessage = directRes.message;
      }
    } catch (err) {
      console.warn('[Sync] Direct browser webhook dispatch error:', err);
    }
  }

  // 4. Fallback: also send a copy to /api/submissions just for server-side backup (optional)
  try {
    fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission, webhookUrl: activeWebhookUrl }),
    }).catch(e => console.warn('[Sync] /api/submissions backup post failed:', e));
  } catch (e) {
    // Ignore server error
  }

  return {
    success: true,
    syncedToSheets: isSynced,
    message: isSynced
      ? 'Successfully submitted and auto-synced to Google Sheets!'
      : apiMessage || 'Successfully submitted and saved to research server!',
  };
}

export function deleteSubmissionLocally(id: string): QuestionnaireSubmission[] {
  const current = getStoredSubmissions();
  const updated = current.filter((s) => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    fetch(`/api/submissions?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  } catch (e) {
    console.error('Failed to delete submission', e);
  }
  return updated;
}

/**
 * Forwards submission payload to Google Sheets Webhook (Apps Script)
 */
export async function syncToGoogleSheets(
  submission: QuestionnaireSubmission,
  webhookUrl: string
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || webhookUrl.includes('EXAMPLE')) {
    return {
      success: false,
      message: 'Google Sheets Webhook URL is not configured yet. Response saved locally in browser memory.',
    };
  }

  // Format payload for Google Apps Script
  const flatPayload = {
    refNumber: submission.refNumber,
    completedAt: submission.completedAt,
    completedByRole: submission.completedByRole,
    respondentIdentifier: submission.respondentIdentifier,
    isAnonymous: submission.isAnonymous ? 'YES' : 'NO',
    pdpaConsent: submission.pdpaConsent ? 'YES' : 'NO',
    isEligible: submission.qualification.isEligible ? 'QUALIFIED' : 'DISQUALIFIED',
    qualificationNote: submission.qualification.summaryNote,
    failedCriteriaCodes: submission.qualification.failedCriteria.map((f) => f.code).join(', ') || 'None',

    // Part A
    qA1_thailandRegistered: submission.partA.qA1_thailandRegistered,
    qA2_firmSize: submission.partA.qA2_firmSize,
    qA3_digitalServiceRevenue: submission.partA.qA3_digitalServiceRevenue,
    qA4_aiImplementationStage: submission.partA.qA4_aiImplementationStage,
    qA5_informantRole: submission.partA.qA5_informantRole,
    qA5_referralDetails: submission.partA.qA5_referralDetails || '',
    qA6_operatingHistory: submission.partA.qA6_operatingHistory,

    // Part B
    businessName: submission.partB.qB1_firmNameOrPseudonym,
    businessWebsite: submission.partB.businessWebsite || '',
    emailAddress: submission.partB.emailAddress || '',
    phoneNumber: submission.partB.phoneNumber || '',
    qB1_firmNameOrPseudonym: submission.partB.qB1_firmNameOrPseudonym,
    qB2_yearEstablished: submission.partB.qB2_yearEstablished,
    qB3_employeeCountBand: submission.partB.qB3_employeeCountBand,
    qB4_revenueBand: submission.partB.qB4_revenueBand,
    qB5_primaryCategory: submission.partB.qB5_primaryCategory + (submission.partB.qB5_otherCategory ? ` (${submission.partB.qB5_otherCategory})` : ''),
    qB6_ownershipStructure: submission.partB.qB6_ownershipStructure.join('; '),
    qB7_primaryMarket: submission.partB.qB7_primaryMarket,

    // Part C
    qC1_aiUsageDuration: submission.partC.qC1_aiUsageDuration,
    qC2_aiApplicationTypes: submission.partC.qC2_aiApplicationTypes.join('; '),
    qC3_functionalAreas: submission.partC.qC3_functionalAreas.join('; '),
    qC4_integrationDepth: submission.partC.qC4_integrationDepth,
    qC5_internalDataQuality: submission.partC.qC5_shapingFactors.internalDataQuality,
    qC5_skillsKnowledge: submission.partC.qC5_shapingFactors.skillsKnowledge,
    qC5_financialResources: submission.partC.qC5_shapingFactors.financialResources,
    qC5_externalExpertise: submission.partC.qC5_shapingFactors.externalExpertise,
    qC5_institutionalSupport: submission.partC.qC5_shapingFactors.institutionalSupport,

    // Part D (ACAP)
    qD1_knowledgeAcquisition: submission.partD.qD1_knowledgeAcquisition,
    qD2_knowledgeAssimilation: submission.partD.qD2_knowledgeAssimilation,
    qD3_knowledgeTransformation: submission.partD.qD3_knowledgeTransformation,
    qD4_knowledgeExploitation: submission.partD.qD4_knowledgeExploitation,
    qD5_potentialRealizedGap: submission.partD.qD5_potentialRealizedGap,
    qD6_reverseAssimilation: submission.partD.qD6_reverseAssimilation,

    // Part E (BMI)
    qE1_valueProposition: submission.partE.qE1_valueProposition,
    qE2_valueCreationArchitecture: submission.partE.qE2_valueCreationArchitecture,
    qE3_revenueModel: submission.partE.qE3_revenueModel,
    qE4_overallDepthChange: submission.partE.qE4_overallDepthChange,
    qE5_explorationVsExploitation: submission.partE.qE5_explorationVsExploitation,
  };

  try {
    // Standard Google Apps Script webhooks handle POST with text/plain body in no-cors mode
    // This works reliably across mobile Safari, Android Chrome, and desktop browsers without CORS preflight failures
    await fetch(webhookUrl.trim(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(flatPayload),
    });

    return {
      success: true,
      message: 'Successfully dispatched response to Google Sheets Webhook!',
    };
  } catch (error: any) {
    console.error('Error syncing to Google Sheets webhook', error);
    return {
      success: false,
      message: `Failed to connect to Google Sheets Webhook: ${error.message || 'Network error'}. Response retained locally.`,
    };
  }
}

/**
 * Returns complete Apps Script code to paste into Google Sheet's Apps Script editor.
 */
export function getGoogleAppsScriptCode(): string {
  return `/**
 * GOOGLE APPS SCRIPT FOR BANGKOK UNIVERSITY AI SME RESEARCH FORM
 * 
 * Instructions:
 * 1. Open your target Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Replace all existing code in Code.gs with this snippet.
 * 4. Click 'Deploy' > 'New deployment'.
 * 5. Select type 'Web app'.
 * 6. Execute as: 'Me' (your Google account).
 * 7. Who has access: 'Anyone' (so form respondents can submit anonymously).
 * 8. Click 'Deploy', authorize permissions, and copy the Web App URL.
 * 9. Paste the Web App URL into the Admin Settings of your AI SME Research Form!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if headers exist; if not, create them
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp", "Ref Number", "Research Identifier", "Role / Position", "Eligibility", 
        "Firm Name / Pseudonym", "Business Website", "Pseudonym Used", "Year Established", "Employees Band", "Revenue Band",
        "Primary Category", "Ownership Structure", "Primary Market", "AI Usage Duration", 
        "AI Application Types", "Functional Areas Used", "Integration Depth", 
        "C5 Data Quality (1-5)", "C5 Skills/Knowledge (1-5)", "C5 Financial (1-5)", "C5 External (1-5)", "C5 Institutional (1-5)",
        "D1 ACAP Acquisition", "D2 ACAP Assimilation", "D3 ACAP Transformation", "D4 ACAP Exploitation", "D5 ACAP Gap", "D6 ACAP Rev Assimilation",
        "E1 BMI Value Prop", "E2 BMI Value Creation", "E3 BMI Revenue Model", "E4 BMI Overall Depth", "E5 BMI Exploration vs Exploitation",
        "A1 Thai Reg", "A2 SME Size", "A3 Digital Rev", "A4 AI Stage", "A5 Informant", "A6 History"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1E1B4B").setFontColor("#FFFFFF");
    }

    var data = JSON.parse(e.postData.contents);

    var row = [
      data.completedAt || new Date().toISOString(),
      data.refNumber || "",
      data.respondentIdentifier || "",
      data.completedByRole || "",
      data.isEligible || "",
      data.qB1_firmNameOrPseudonym || "",
      data.businessWebsite || "",
      data.isPseudonymUsed || "NO",
      data.qB2_yearEstablished || "",
      data.qB3_employeeCountBand || "",
      data.qB4_revenueBand || "",
      data.qB5_primaryCategory || "",
      data.qB6_ownershipStructure || "",
      data.qB7_primaryMarket || "",
      data.qC1_aiUsageDuration || "",
      data.qC2_aiApplicationTypes || "",
      data.qC3_functionalAreas || "",
      data.qC4_integrationDepth || "",
      data.qC5_internalDataQuality || "",
      data.qC5_skillsKnowledge || "",
      data.qC5_financialResources || "",
      data.qC5_externalExpertise || "",
      data.qC5_institutionalSupport || "",
      data.qD1_knowledgeAcquisition || "",
      data.qD2_knowledgeAssimilation || "",
      data.qD3_knowledgeTransformation || "",
      data.qD4_knowledgeExploitation || "",
      data.qD5_potentialRealizedGap || "",
      data.qD6_reverseAssimilation || "",
      data.qE1_valueProposition || "",
      data.qE2_valueCreationArchitecture || "",
      data.qE3_revenueModel || "",
      data.qE4_overallDepthChange || "",
      data.qE5_explorationVsExploitation || "",
      data.qA1_thailandRegistered || "",
      data.qA2_firmSize || "",
      data.qA3_digitalServiceRevenue || "",
      data.qA4_aiImplementationStage || "",
      data.qA5_informantRole || "",
      data.qA6_operatingHistory || ""
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ result: "success", rowAdded: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
}

/**
 * Converts submissions array to CSV file string
 */
export function exportSubmissionsToCSV(submissions: QuestionnaireSubmission[]): string {
  if (submissions.length === 0) return '';

  const headers = [
    'Ref Number',
    'Completed At',
    'Role/Position',
    'Identifier',
    'Eligibility',
    'Business Name',
    'Business Website',
    'Email Address',
    'Phone Number',
    'Year Established',
    'Employees',
    'Revenue Band',
    'Primary Digital Service',
    'Ownership Structure',
    'Geographic Market',
    'AI Usage Duration',
    'AI App Types',
    'AI Functional Areas',
    'AI Integration Depth',
    'ACAP D1 Acquisition',
    'ACAP D2 Assimilation',
    'ACAP D3 Transformation',
    'ACAP D4 Exploitation',
    'ACAP D5 Gap',
    'ACAP D6 Additional Process',
    'BMI E1 Value Prop',
    'BMI E2 Value Creation',
    'BMI E3 Revenue Model',
    'BMI E4 Depth',
    'BMI E5 Exploitation'
  ];

  const csvRows = [headers.join(',')];

  submissions.forEach((s) => {
    const row = [
      `"${s.refNumber}"`,
      `"${s.completedAt}"`,
      `"${s.completedByRole.replace(/"/g, '""')}"`,
      `"${s.respondentIdentifier}"`,
      `"${s.qualification.isEligible ? 'QUALIFIED' : 'DISQUALIFIED'}"`,
      `"${(s.partB.qB1_firmNameOrPseudonym || '').replace(/"/g, '""')}"`,
      `"${(s.partB.businessWebsite || '').replace(/"/g, '""')}"`,
      `"${(s.partB.emailAddress || '').replace(/"/g, '""')}"`,
      `"${(s.partB.phoneNumber || '').replace(/"/g, '""')}"`,
      `"${s.partB.qB2_yearEstablished}"`,
      `"${s.partB.qB3_employeeCountBand}"`,
      `"${s.partB.qB4_revenueBand}"`,
      `"${(s.partB.qB5_primaryCategory || '').replace(/"/g, '""')}"`,
      `"${s.partB.qB6_ownershipStructure.join('; ').replace(/"/g, '""')}"`,
      `"${s.partB.qB7_primaryMarket}"`,
      `"${s.partC.qC1_aiUsageDuration}"`,
      `"${s.partC.qC2_aiApplicationTypes.join('; ').replace(/"/g, '""')}"`,
      `"${s.partC.qC3_functionalAreas.join('; ').replace(/"/g, '""')}"`,
      `"${s.partC.qC4_integrationDepth}"`,
      s.partD.qD1_knowledgeAcquisition,
      s.partD.qD2_knowledgeAssimilation,
      s.partD.qD3_knowledgeTransformation,
      s.partD.qD4_knowledgeExploitation,
      s.partD.qD5_potentialRealizedGap,
      s.partD.qD6_reverseAssimilation,
      s.partE.qE1_valueProposition,
      s.partE.qE2_valueCreationArchitecture,
      s.partE.qE3_revenueModel,
      s.partE.qE4_overallDepthChange,
      s.partE.qE5_explorationVsExploitation
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}
