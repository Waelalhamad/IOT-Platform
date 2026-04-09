import mongoose, { Document, Model } from 'mongoose';
import { env } from '../config/env';

export type SensorValue = number | { r: number; g: number; b: number };

export interface ISensorReading extends Document {
  deviceId: mongoose.Types.ObjectId;
  sensorType: string;
  value: SensorValue;
  unit: string;
  timestamp: Date;
}

const sensorReadingSchema = new mongoose.Schema<ISensorReading>(
  {
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    sensorType: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    unit: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true, timestamps: false }
);

// Compound index for fast time-range queries
sensorReadingSchema.index({ deviceId: 1, sensorType: 1, timestamp: -1 });

// TTL index — auto-delete after N days
sensorReadingSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: env.SENSOR_READING_TTL_DAYS * 86400 }
);

export const SensorReading = mongoose.model<ISensorReading>('SensorReading', sensorReadingSchema);
