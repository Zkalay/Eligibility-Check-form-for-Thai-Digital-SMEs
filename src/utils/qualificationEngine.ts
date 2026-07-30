import { PartAResponses, QualificationStatus } from '../types';

export function evaluateEligibility(partA: PartAResponses): QualificationStatus {
  const failedCriteria: QualificationStatus['failedCriteria'] = [];

  // A1 check
  if (partA.qA1_thailandRegistered === 'No') {
    failedCriteria.push({
      code: 'A1',
      title: 'Firm Registration & Location',
      reason:
        'This study focuses strictly on firms registered and primarily operating in Thailand.',
    });
  }

  // A2 check
  if (partA.qA2_firmSize === 'Micro') {
    failedCriteria.push({
      code: 'A2',
      title: 'Firm Size (OSMEP Criteria)',
      reason:
        'Microenterprises (1–5 employees or annual revenue under THB 1.8M) are outside the current study scope.',
    });
  } else if (partA.qA2_firmSize === 'Exceeds') {
    failedCriteria.push({
      code: 'A2',
      title: 'Firm Size (OSMEP Criteria)',
      reason:
        'Firms exceeding the SME threshold (more than 100 employees or annual revenue above THB 300M) are outside the current study scope.',
    });
  }

  // A3 check
  if (partA.qA3_digitalServiceRevenue === 'No') {
    failedCriteria.push({
      code: 'A3',
      title: 'Core Business Type',
      reason:
        'This study is specifically scoped to digital service firms where primary revenue comes from digitally mediated or data-intensive services.',
    });
  }

  // A4 check
  if (
    partA.qA4_aiImplementationStage === 'considering_planning' ||
    partA.qA4_aiImplementationStage === 'pilots_experiments'
  ) {
    failedCriteria.push({
      code: 'A4',
      title: 'AI Implementation Stage',
      reason:
        'This study requires firms where AI has moved beyond planning or pilot experimentation and is actively embedded in regular operations or service delivery.',
    });
  }

  // A5 check
  if (partA.qA5_informantRole === 'No') {
    failedCriteria.push({
      code: 'A5',
      title: 'Informant Role',
      reason:
        'Participation requires an owner-manager, founder, or senior decision-maker directly involved in AI strategy and business model development.',
    });
  }

  // A6 check
  if (partA.qA6_operatingHistory === 'No') {
    failedCriteria.push({
      code: 'A6',
      title: 'Operating History',
      reason:
        'This study requires at least 2 years of operating history to reflect meaningfully on AI integration over time.',
    });
  }

  const isEligible = failedCriteria.length === 0;

  let summaryNote = '';
  if (isEligible) {
    summaryNote =
      'Congratulations! Your firm meets all inclusion criteria for the Bangkok University research study. Please proceed to complete the background and AI profile sections.';
  } else {
    summaryNote =
      'Thank you for your interest in this research. Based on your answers, your firm does not currently meet one or more inclusion criteria for this specific study sample.';
  }

  return {
    isEligible,
    failedCriteria,
    summaryNote,
  };
}
