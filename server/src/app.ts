import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import deviceRoutes from './routes/devices';
import sensorRoutes from './routes/sensors';
import dashboardRoutes from './routes/dashboard';
import mqttAuthRoutes from './routes/mqttAuth';

const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// ── Compression ─────────────────────────────────────────────────────────────
app.use(compression());

// ── Parsing ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ── Logging ─────────────────────────────────────────────────────────────────
// Always log requests — use 'combined' in prod for full details
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Global API rate limit (all /api routes) ─────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/devices',   deviceRoutes);
app.use('/api/sensors',   sensorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mqtt',      mqttAuthRoutes);

// ── Health checks ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Readiness — checks that DB and MQTT are actually connected
app.get('/health/ready', async (_req, res) => {
  try {
    const mongoose = await import('mongoose');
    const dbOk = mongoose.default.connection.readyState === 1; // 1 = connected

    const mqttService = _req.app.get('mqttService');
    const mqttOk = mqttService ? (mqttService as { isConnected?: () => boolean }).isConnected?.() ?? true : false;

    if (!dbOk) {
      res.status(503).json({ status: 'not ready', db: 'disconnected', mqtt: mqttOk ? 'ok' : 'disconnected' });
      return;
    }
    res.json({ status: 'ready', db: 'ok', mqtt: mqttOk ? 'ok' : 'connecting' });
  } catch {
    res.status(503).json({ status: 'error' });
  }
});

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
