const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwWIAtha5iMCvl04wW6qlTA5TACxMAQzy2jBvymR1Qnf3wUL_KYKMCDHsb2Y2xaWD8gYQ/exec';

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

  // Use global cache to persist across warm invocations
  if (!globalThis._serverConfigCache) {
    globalThis._serverConfigCache = {
      webhookUrl: process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL || '',
      autoSync: true,
    };
  }

  try {
    if (req.method === 'GET') {
      const currentConfig = { ...globalThis._serverConfigCache };
      
      // If server cache is empty or example, try to use default
      if (!currentConfig.webhookUrl || currentConfig.webhookUrl.includes('EXAMPLE')) {
        currentConfig.webhookUrl = DEFAULT_WEBHOOK_URL;
      }

      return res.status(200).json({
        success: true,
        config: currentConfig,
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      if (body.webhookUrl !== undefined) {
        globalThis._serverConfigCache.webhookUrl = body.webhookUrl;
      }
      if (body.sheetName !== undefined) {
        globalThis._serverConfigCache.sheetName = body.sheetName;
      }
      if (body.autoSync !== undefined) {
        globalThis._serverConfigCache.autoSync = body.autoSync;
      }

      return res.status(200).json({
        success: true,
        message: 'Server configuration updated (in-memory).',
        config: globalThis._serverConfigCache,
      });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[Config API Error]:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}
