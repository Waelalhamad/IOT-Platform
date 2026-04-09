import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { SensorReading } from '../models/SensorReading';
import { Device } from '../models/Device';
import { createError } from '../middleware/errorHandler';

const historySchema = z.object({
  deviceId: z.string().min(1),
  sensorType: z.string().min(1),
  range: z.enum(['1h', '6h', '24h', '7d']).default('1h'),
});

// Resolution map: range → interval in milliseconds
const RESOLUTION_MS: Record<string, number | null> = {
  '1h': null,           // raw
  '6h': 60_000,         // 1-min avg
  '24h': 5 * 60_000,    // 5-min avg
  '7d': 30 * 60_000,    // 30-min avg
};

const RANGE_MS: Record<string, number> = {
  '1h': 60 * 60_000,
  '6h': 6 * 60 * 60_000,
  '24h': 24 * 60 * 60_000,
  '7d': 7 * 24 * 60 * 60_000,
};

export async function getSensorHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const { deviceId, sensorType, range } = historySchema.parse(req.query);

    // Verify ownership
    const device = await Device.findOne({ _id: deviceId, userId: req.user!.userId });
    if (!device) throw createError('Device not found', 404);

    const now = Date.now();
    const from = new Date(now - RANGE_MS[range]);
    const to = new Date(now);
    const intervalMs = RESOLUTION_MS[range];

    const deviceObjId = new mongoose.Types.ObjectId(deviceId);

    let data: Array<{ timestamp: Date; value: unknown; min?: unknown; max?: unknown }>;

    if (intervalMs === null) {
      // Raw data for 1h
      const docs = await SensorReading.find(
        { deviceId: deviceObjId, sensorType, timestamp: { $gte: from, $lte: to } },
        { value: 1, timestamp: 1, _id: 0 }
      ).sort({ timestamp: 1 }).limit(1800).lean();

      data = docs.map(d => ({ timestamp: d.timestamp, value: d.value }));
    } else {
      // Aggregated data
      // Handle numeric vs object (TCS230) sensors differently
      const pipeline: mongoose.PipelineStage[] = [
        {
          $match: {
            deviceId: deviceObjId,
            sensorType,
            timestamp: { $gte: from, $lte: to },
          },
        },
        {
          $group: {
            _id: {
              bucket: {
                $subtract: [
                  { $toLong: '$timestamp' },
                  { $mod: [{ $toLong: '$timestamp' }, intervalMs] },
                ],
              },
            },
            // Numeric value fields
            avg: { $avg: '$value' },
            min: { $min: '$value' },
            max: { $max: '$value' },
            // For TCS230 {r,g,b}
            avgR: { $avg: '$value.r' },
            avgG: { $avg: '$value.g' },
            avgB: { $avg: '$value.b' },
            timestamp: { $first: '$timestamp' },
            sampleValue: { $first: '$value' },
          },
        },
        { $sort: { '_id.bucket': 1 } as mongoose.PipelineStage.Sort['$sort'] },
      ];

      const results = await SensorReading.aggregate(pipeline);

      data = results.map(r => {
        // Determine if numeric or object
        const isObject = r.sampleValue !== null && typeof r.sampleValue === 'object';
        const value = isObject
          ? { r: Math.round(r.avgR ?? 0), g: Math.round(r.avgG ?? 0), b: Math.round(r.avgB ?? 0) }
          : r.avg;
        const min = isObject ? undefined : r.min;
        const max = isObject ? undefined : r.max;
        return { timestamp: r.timestamp, value, min, max };
      });
    }

    res.json({
      success: true,
      data,
      meta: { deviceId, sensorType, range, count: data.length, from, to },
    });
  } catch (err) {
    next(err);
  }
}
