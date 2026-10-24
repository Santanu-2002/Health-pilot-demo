import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { validateEnv } from './src/config/env.js';
import { connectDatabase } from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import doctorRoutes from './src/routes/doctors.js';
import appointmentRoutes from './src/routes/appointment.js';
import agentRoutes from './src/routes/agent.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';
import { rateLimit } from './src/middleware/rateLimit.js';

const app = express();
const PORT = Number(process.env.PORT || 5000);
// const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((v) => v.trim());
const allowedOrigins = [
  'https://health-pilot-demo-web-app-git-main-santanu-2002s-projects.vercel.app',
  'http://localhost:5173',
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean),
];
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); return callback(new Error('Origin is not allowed by CORS.')); }, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.headers.origin && !allowedOrigins.includes(req.headers.origin)) return res.status(403).json({ message: 'Request origin is not allowed.' });
  next();
});
app.use('/api', rateLimit({ windowMs: 60_000, max: 120, keyPrefix: 'api' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60_000, max: 30, keyPrefix: 'auth' }));
app.use('/api/ai', rateLimit({ windowMs: 60_000, max: 20, keyPrefix: 'ai' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'HealthPilot AI API', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/ai', agentRoutes);
app.use(notFound);
app.use(errorHandler);

try {
  validateEnv();
  await connectDatabase();
  app.listen(PORT, () => console.log(`HealthPilot AI API listening on port ${PORT}`));
} catch (error) {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
}
