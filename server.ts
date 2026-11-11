/**
 * AI HEALTH CARE - Express Backend & Vite Dev Server
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './backend/routes/auth.ts';
import screeningRoutes from './backend/routes/screening.ts';
import medicinesRoutes from './backend/routes/medicines.ts';
import historyRoutes from './backend/routes/history.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Large payload allowance for base64 clinical photos & PDF reports
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/screening', screeningRoutes);
  app.use('/api/medicines', medicinesRoutes);
  app.use('/api/history', historyRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'AI HEALTH CARE',
      timestamp: new Date().toISOString(),
    });
  });

  // Catch-all for any unhandled /api routes - return JSON 404, NEVER fall through to Vite index.html
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
      success: false,
    });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const url = `http://localhost:${PORT}`;
    console.log(`[AI HEALTH CARE] Server running on ${url}`);
    // Auto-open browser in dev mode if desktop environment is present
    if (!isProd && process.env.NODE_ENV !== 'test' && !process.env.AI_STUDIO_BUILD) {
      import('child_process').then(({ exec }) => {
        const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
        exec(`${cmd} ${url}`, () => {});
      }).catch(() => {});
    }
  });
}

startServer().catch((err) => {
  console.error('[AI HEALTH CARE] Fatal Server Initialization Error:', err);
  process.exit(1);
});
