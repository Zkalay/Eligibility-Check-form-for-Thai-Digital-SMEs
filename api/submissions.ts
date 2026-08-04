import { DEFAULT_GOOGLE_SHEETS_CONFIG } from '../src/data/defaultConfig';

// Serverless Function for Vercel & Express API
// Global in-memory storage across warm serverless invocations
declare global {
  var _submissionsCache: any[];
  var _serverConfigCache: { webhookUrl?: string; sheetName?: string; autoSync?: boolean };
}

if (!globalThis._submissionsCache) {
  globalThis._submissionsCache = [];
}

if (!globalThis._serverConfigCache) {
  globalThis._serverConfigCache = {
    webhookUrl: process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL || '',
    autoSync: true,
  };
}

export async function handleSubmissionsRequest(req: any, res: any) {
  // CORS Headers for Vercel Serverless Function & Mobile clients
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        count: globalThis._submissionsCache.length,
        submissions: globalThis._submissionsCache,
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const submission = body?.submission || body;

      if (!submission || !submission.id) {
        return res.status(400).json({ success: false, message: 'Invalid submission data' });
      }

      // Add to server memory cache (deduplicated by ID)
      const existingIdx = globalThis._submissionsCache.findIndex((s) => s.id === submission.id);
      if (existingIdx >= 0) {
        globalThis._submissionsCache[existingIdx] = submission;
      } else {
        globalThis._submissionsCache.unshift(submission);
      }

      // Check for webhook URL (from payload, server cache, process.env, or default config)
      const webhookUrl =
        body?.webhookUrl ||
        globalThis._serverConfigCache?.webhookUrl ||
        process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
        process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
        DEFAULT_GOOGLE_SHEETS_CONFIG.webhookUrl ||
        '';

      // Check if submission was already synced to Google Sheets by the browser client
      let syncedToSheets = Boolean(submission.syncedToGoogleSheets || body?.alreadySyncedToSheets);
      let syncMessage = syncedToSheets ? 'Already synced to Google Sheets directly from browser client.' : '';

      // Only forward to Google Sheets from server if NOT already synced by client
      if (!syncedToSheets && webhookUrl && !webhookUrl.includes('EXAMPLE')) {
        try {
          const flatPayload = buildGoogleSheetsPayload(submission);
          await fetch(webhookUrl.trim(), {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(flatPayload),
          });
          syncedToSheets = true;
          syncMessage = 'Successfully synced to Google Sheets!';
          submission.syncedToGoogleSheets = true;
          submission.syncTimestamp = new Date().toISOString();
        } catch (err: any) {
          console.error('[Server] Google Sheets forward failed:', err);
          syncMessage = `Google Sheets webhook error: ${err.message || 'Failed'}`;
        }
      } else if (!syncedToSheets) {
        syncMessage = 'No valid Google Sheets webhook configured on server.';
      }

      return res.status(200).json({
        success: true,
        syncedToSheets,
        syncMessage,
        submission,
        totalStored: globalThis._submissionsCache.length,
      });
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id || (req.body && JSON.parse(req.body)?.id);
      if (id) {
        globalThis._submissionsCache = globalThis._submissionsCache.filter((s) => s.id !== id);
      }
      return res.status(200).json({
        success: true,
        count: globalThis._submissionsCache.length,
        submissions: globalThis._submissionsCache,
      });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[Server API Error]:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}

export default handleSubmissionsRequest;

function buildGoogleSheetsPayload(submission: any) {
  return {
    refNumber: submission.refNumber,
    completedAt: submission.completedAt,
    completedByRole: submission.completedByRole,
    respondentIdentifier: submission.respondentIdentifier,
    isAnonymous: submission.isAnonymous ? 'YES' : 'NO',
    pdpaConsent: submission.pdpaConsent ? 'YES' : 'NO',
    isEligible: submission.qualification?.isEligible ? 'QUALIFIED' : 'DISQUALIFIED',
    qualificationNote: submission.qualification?.summaryNote || '',
    failedCriteriaCodes: submission.qualification?.failedCriteria?.map((f: any) => f.code).join(', ') || 'None',

    // Part A
    qA1_thailandRegistered: submission.partA?.qA1_thailandRegistered,
    qA2_firmSize: submission.partA?.qA2_firmSize,
    qA3_digitalServiceRevenue: submission.partA?.qA3_digitalServiceRevenue,
    qA4_aiImplementationStage: submission.partA?.qA4_aiImplementationStage,
    qA5_informantRole: submission.partA?.qA5_informantRole,
    qA5_referralDetails: submission.partA?.qA5_referralDetails || '',
    qA6_operatingHistory: submission.partA?.qA6_operatingHistory,

    // Part B
    businessName: submission.partB?.qB1_firmNameOrPseudonym,
    businessWebsite: submission.partB?.businessWebsite || '',
    emailAddress: submission.partB?.emailAddress || '',
    phoneNumber: submission.partB?.phoneNumber || '',
    qB1_firmNameOrPseudonym: submission.partB?.qB1_firmNameOrPseudonym,
    qB2_yearEstablished: submission.partB?.qB2_yearEstablished,
    qB3_employeeCountBand: submission.partB?.qB3_employeeCountBand,
    qB4_revenueBand: submission.partB?.qB4_revenueBand,
    qB5_primaryCategory: (submission.partB?.qB5_primaryCategory || '') + (submission.partB?.qB5_otherCategory ? ` (${submission.partB.qB5_otherCategory})` : ''),
    qB6_ownershipStructure: Array.isArray(submission.partB?.qB6_ownershipStructure) ? submission.partB.qB6_ownershipStructure.join('; ') : '',
    qB7_primaryMarket: submission.partB?.qB7_primaryMarket,

    // Part C
    qC1_aiUsageDuration: submission.partC?.qC1_aiUsageDuration,
    qC2_aiApplicationTypes: Array.isArray(submission.partC?.qC2_aiApplicationTypes) ? submission.partC.qC2_aiApplicationTypes.join('; ') : '',
    qC3_functionalAreas: Array.isArray(submission.partC?.qC3_functionalAreas) ? submission.partC.qC3_functionalAreas.join('; ') : '',
    qC4_integrationDepth: submission.partC?.qC4_integrationDepth,
    qC5_internalDataQuality: submission.partC?.qC5_shapingFactors?.internalDataQuality,
    qC5_skillsKnowledge: submission.partC?.qC5_shapingFactors?.skillsKnowledge,
    qC5_financialResources: submission.partC?.qC5_shapingFactors?.financialResources,
    qC5_externalExpertise: submission.partC?.qC5_shapingFactors?.externalExpertise,
    qC5_institutionalSupport: submission.partC?.qC5_shapingFactors?.institutionalSupport,

    // Part D (ACAP)
    qD1_knowledgeAcquisition: submission.partD?.qD1_knowledgeAcquisition,
    qD2_knowledgeAssimilation: submission.partD?.qD2_knowledgeAssimilation,
    qD3_knowledgeTransformation: submission.partD?.qD3_knowledgeTransformation,
    qD4_knowledgeExploitation: submission.partD?.qD4_knowledgeExploitation,
    qD5_potentialRealizedGap: submission.partD?.qD5_potentialRealizedGap,
    qD6_reverseAssimilation: submission.partD?.qD6_reverseAssimilation,

    // Part E (BMI)
    qE1_valueProposition: submission.partE?.qE1_valueProposition,
    qE2_valueCreationArchitecture: submission.partE?.qE2_valueCreationArchitecture,
    qE3_revenueModel: submission.partE?.qE3_revenueModel,
    qE4_overallDepthChange: submission.partE?.qE4_overallDepthChange,
    qE5_explorationVsExploitation: submission.partE?.qE5_explorationVsExploitation,
  };
}
