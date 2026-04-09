import mqtt from 'mqtt';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { WebSocketService } from './WebSocketService';

interface SensorPayload {
  sensors: Array<{ type: string; value: unknown; unit: string }>;
}

interface RateBucket {
  count: number;
  resetAt: number;
}

/** Lightweight synchronous sliding-window rate limiter (no external dependency). */
class SyncRateLimiter {
  private buckets = new Map<string, RateBucket>();
  private readonly points: number;
  private readonly windowMs: number;

  constructor(points: number, durationSeconds: number) {
    this.points = points;
    this.windowMs = durationSeconds * 1000;
  }

  /** Returns true if the key is within limit, false if rate-limited. */
  tryConsume(key: string): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + this.windowMs };
      this.buckets.set(key, bucket);
    }
    if (bucket.count >= this.points) return false;
    bucket.count++;
    return true;
  }
}

export class MQTTService {
  private client!: mqtt.MqttClient;
  private wsService: WebSocketService;
  private rateLimiter: SyncRateLimiter;
  // In-memory device cache: deviceId → { mqttUsername }
  private deviceCache = new Map<string, { mqttUsername: string }>();

  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
    this.rateLimiter = new SyncRateLimiter(100, 60); // 100 msgs per 60s
  }

  async connect(): Promise<void> {
    // Load all devices into cache
    await this.refreshDeviceCache();

    this.client = mqtt.connect(env.MQTT_BROKER_URL, {
      username: env.MQTT_USERNAME,
      password: env.MQTT_PASSWORD,
      clientId: `esp-monitor-server-${process.pid}`,
      clean: false,
      reconnectPeriod: 5000,
    });

    this.client.on('connect', () => {
      logger.info('✅ MQTT connected to broker');
      this.client.subscribe('esp/+/sensors', { qos: 1 });
      this.client.subscribe('esp/+/status', { qos: 1 });
    });

    this.client.on('message', (topic, buffer) => {
      this.handleMessage(topic, buffer);
    });

    this.client.on('error', (err) => logger.error('MQTT error:', err));
    this.client.on('reconnect', () => logger.warn('MQTT reconnecting...'));
    this.client.on('offline', () => logger.warn('MQTT offline'));

    // Refresh device cache every 60s
    setInterval(() => void this.refreshDeviceCache(), 60_000);
  }

  private handleMessage(topic: string, buffer: Buffer): void {
    // Handle status messages (LWT)
    if (topic.includes('/status')) {
      const deviceId = topic.split('/')[1];
      const status = buffer.toString();
      if (status === 'offline') {
        void this.handleDeviceOffline(deviceId);
      }
      return;
    }

    // Fast synchronous path — no await
    const raw = buffer.toString();
    let payload: SensorPayload;
    try {
      payload = JSON.parse(raw);
    } catch {
      logger.warn(`Malformed MQTT payload on topic: ${topic}`);
      return;
    }

    if (!payload?.sensors || !Array.isArray(payload.sensors)) return;

    const parts = topic.split('/');
    const topicDeviceId = parts[1];

    // Rate limit check (synchronous)
    if (!this.rateLimiter.tryConsume(topicDeviceId)) {
      logger.debug(`Rate limit exceeded for device: ${topicDeviceId}`);
      return;
    }

    // Verify device is in cache
    const device = this.deviceCache.get(topicDeviceId);
    if (!device) {
      logger.debug(`Unknown device: ${topicDeviceId}, skipping`);
      return;
    }

    // BROADCAST FIRST — before any async DB operations
    this.wsService.broadcastReading(topicDeviceId, payload.sensors);

    // Persist async in background
    void this.persistReading(topicDeviceId, payload.sensors);
  }

  private async persistReading(deviceId: string, sensors: SensorPayload['sensors']): Promise<void> {
    try {
      // Dynamic import to avoid circular deps
      const { Device } = await import('../models/Device');
      const { SensorReading } = await import('../models/SensorReading');

      await Device.updateOne({ _id: deviceId }, { lastSeen: new Date(), status: 'online' });

      const docs = sensors.map(s => ({
        deviceId,
        sensorType: s.type,
        value: s.value,
        unit: s.unit,
        timestamp: new Date(),
      }));
      await SensorReading.insertMany(docs);
    } catch (err) {
      logger.error('Failed to persist sensor reading:', err);
    }
  }

  private async handleDeviceOffline(deviceId: string): Promise<void> {
    try {
      const { Device } = await import('../models/Device');
      await Device.updateOne({ _id: deviceId }, { status: 'offline' });
      this.wsService.broadcastDeviceStatus(deviceId, 'offline');
    } catch (err) {
      logger.error('Failed to handle device offline:', err);
    }
  }

  private async refreshDeviceCache(): Promise<void> {
    try {
      const { Device } = await import('../models/Device');
      const devices = await Device.find({}, { _id: 1, mqttUsername: 1 }).lean();
      this.deviceCache.clear();
      for (const d of devices) {
        this.deviceCache.set(d._id.toString(), { mqttUsername: d.mqttUsername });
      }
      logger.debug(`Device cache refreshed: ${this.deviceCache.size} devices`);
    } catch (err) {
      logger.error('Failed to refresh device cache:', err);
    }
  }

  addToCache(deviceId: string, mqttUsername: string): void {
    this.deviceCache.set(deviceId, { mqttUsername });
  }

  removeFromCache(deviceId: string): void {
    this.deviceCache.delete(deviceId);
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  disconnect(): void {
    this.client?.end(true);
  }
}
