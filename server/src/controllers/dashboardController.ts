import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { DashboardLayout } from '../models/DashboardLayout';
import { Device } from '../models/Device';
import { createError } from '../middleware/errorHandler';

const widgetSchema = z.object({
  i: z.string().min(1),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  w: z.number().int().min(1),
  h: z.number().int().min(1),
  type: z.enum(['value-card', 'gauge', 'line-chart', 'color-preview', 'status-badge']),
  sensorType: z.string().min(1),
  config: z.record(z.unknown()).default({}),
});

const putLayoutSchema = z.object({
  deviceId: z.string().min(1),
  widgets: z.array(widgetSchema),
});

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const deviceId = z.string().min(1).parse(req.query.deviceId);

    // Verify ownership
    const device = await Device.findOne({ _id: deviceId, userId: req.user!.userId });
    if (!device) throw createError('Device not found', 404);

    const layout = await DashboardLayout.findOne({
      userId: new mongoose.Types.ObjectId(req.user!.userId),
      deviceId: new mongoose.Types.ObjectId(deviceId),
    });

    res.json({ success: true, data: layout ?? { widgets: [] } });
  } catch (err) {
    next(err);
  }
}

export async function putDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const { deviceId, widgets } = putLayoutSchema.parse(req.body);

    // Verify ownership
    const device = await Device.findOne({ _id: deviceId, userId: req.user!.userId });
    if (!device) throw createError('Device not found', 404);

    const userId = new mongoose.Types.ObjectId(req.user!.userId);
    const deviceObjId = new mongoose.Types.ObjectId(deviceId);

    const layout = await DashboardLayout.findOneAndUpdate(
      { userId, deviceId: deviceObjId },
      { $set: { widgets } },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: layout });
  } catch (err) {
    next(err);
  }
}
