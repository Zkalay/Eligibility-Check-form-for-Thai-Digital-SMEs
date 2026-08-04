import { DEFAULT_GOOGLE_SHEETS_CONFIG } from '../src/data/defaultConfig';

export default async function handleConfigRequest(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const defaultUrl =
      process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      DEFAULT_GOOGLE_SHEETS_CONFIG.webhookUrl ||
      '';

    if (req.method === 'GET') {
      const activeUrl = globalThis._serverConfigCache?.webhookUrl || defaultUrl;
      return res.status(200).json({
        success: true,
        config: {
          webhookUrl: activeUrl,
          sheetName: globalThis._serverConfigCache?.sheetName || DEFAULT_GOOGLE_SHEETS_CONFIG.sheetName || 'Screening Responses',
          autoSync: globalThis._serverConfigCache?.autoSync ?? DEFAULT_GOOGLE_SHEETS_CONFIG.autoSync ?? true,
        },
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body) {
        globalThis._serverConfigCache = {
          webhookUrl: body.webhookUrl || '',
          sheetName: body.sheetName || 'Screening Responses',
          autoSync: body.autoSync !== false,
        };
      }
      return res.status(200).json({
        success: true,
        config: globalThis._serverConfigCache,
      });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[Config API Error]:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}


