import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import handleSubmissionsRequest from './api/submissions';
import handleConfigRequest from './api/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      study: 'Bangkok University SME AI Research Screening Form',
      researcher: 'Isaac Gon Hkaung (Zack)',
    });
  });

  app.all('/api/submissions', (req, res) => {
    handleSubmissionsRequest(req, res);
  });

  app.all('/api/config', (req, res) => {
    handleConfigRequest(req, res);
  });

  // Optional server endpoint to proxy Google Sheets Webhook or log server-side
  app.post('/api/submit', async (req, res) => {
    handleSubmissionsRequest(req, res);
  });

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
