import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class WebSocketService {
  private io!: Server;

  async initialize(httpServer: http.Server): Promise<void> {
    this.io = new Server(httpServer, {
      cors: { origin: env.CORS_ORIGIN, credentials: true },
      transports: ['websocket'],
      perMessageDeflate: false,
      httpCompression: false,
    });

    // Conditional Redis adapter
    if (env.REDIS_URL) {
      const { createAdapter } = await import('@socket.io/redis-adapter');
      const { createClient } = await import('redis');
      const pubClient = createClient({ url: env.REDIS_URL });
      const subClient = pubClient.duplicate();
      await Promise.all([pubClient.connect(), subClient.connect()]);
      this.io.adapter(createAdapter(pubClient, subClient));
      logger.info('Socket.io Redis adapter attached');
    }

    this.io.use((socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      try {
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
        socket.data.userId = payload.userId;
        next();
      } catch {
        next(new Error('Invalid token'));
      }
    });

    this.io.on('connection', (socket) => {
      logger.debug(`Client connected: ${socket.id} (user: ${socket.data.userId})`);

      socket.on('subscribe-device', (deviceId: string) => {
        socket.join(`device:${deviceId}`);
        logger.debug(`Socket ${socket.id} joined room device:${deviceId}`);
      });

      socket.on('unsubscribe-device', (deviceId: string) => {
        socket.leave(`device:${deviceId}`);
      });

      socket.on('disconnect', () => {
        logger.debug(`Client disconnected: ${socket.id}`);
      });
    });

    logger.info('✅ WebSocket service initialized');
  }

  broadcastReading(deviceId: string, sensors: unknown[]): void {
    this.io.to(`device:${deviceId}`).emit('sensor-reading', { deviceId, sensors, timestamp: new Date().toISOString() });
  }

  broadcastDeviceStatus(deviceId: string, status: 'online' | 'offline'): void {
    this.io.to(`device:${deviceId}`).emit('device-status', { deviceId, status, timestamp: new Date().toISOString() });
  }

  close(): void {
    this.io?.close();
  }
}
