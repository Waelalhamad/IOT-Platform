import 'express-async-errors';
import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { logger } from './config/logger';
import { WebSocketService } from './services/WebSocketService';
import { MQTTService } from './services/MQTTService';

// ── Global error handlers ──────────────────────────────────────────────────
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection:', reason);
  // Give logger time to flush then exit — let process manager restart
  setTimeout(() => process.exit(1), 500);
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  setTimeout(() => process.exit(1), 500);
});

async function bootstrap() {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Create HTTP server
  const httpServer = http.createServer(app);

  // 3. Initialize WebSocket service
  const wsService = new WebSocketService();
  await wsService.initialize(httpServer);

  // 4. Initialize MQTT service
  const mqttService = new MQTTService(wsService);
  await mqttService.connect();

  // Expose services to app for use in controllers
  app.set('wsService', wsService);
  app.set('mqttService', mqttService);

  // 5. Start listening
  httpServer.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  // ── Graceful shutdown ────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);

    // Stop accepting new connections
    httpServer.close(() => {
      logger.info('HTTP server closed');
    });

    // Disconnect MQTT and WebSocket
    mqttService.disconnect();
    wsService.close();

    // Force-exit after 10s if requests haven't drained
    setTimeout(() => {
      logger.warn('Forced shutdown after timeout');
      process.exit(0);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
