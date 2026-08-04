export const DEFAULT_GOOGLE_SHEETS_CONFIG = {
  // Default Google Apps Script WebApp URL for automatic response logging to Google Sheets
  webhookUrl:
    (typeof process !== 'undefined' && process.env?.VITE_GOOGLE_SHEETS_WEBHOOK_URL) ||
    (typeof process !== 'undefined' && process.env?.GOOGLE_SHEETS_WEBHOOK_URL) ||
    'https://script.google.com/macros/s/AKfycbwWIAtha5iMCvl04wW6qlTA5TACxMAQzy2jBvymR1Qnf3wUL_KYKMCDHsb2Y2xaWD8gYQ/exec',
  sheetName: 'Screening Responses',
  autoSync: true,
};

