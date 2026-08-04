export const DEFAULT_GOOGLE_SHEETS_CONFIG = {
  // If you deploy to Vercel, you can set VITE_GOOGLE_SHEETS_WEBHOOK_URL in Vercel Environment Variables,
  // or paste your Google Apps Script WebApp URL below as a fallback for all form respondents.
  webhookUrl: process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL || '',
  sheetName: 'Screening Responses',
  autoSync: true,
};
