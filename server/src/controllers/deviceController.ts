import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Device } from '../models/Device';
import { SensorReading } from '../models/SensorReading';
import { DashboardLayout } from '../models/DashboardLayout';
import { createError } from '../middleware/errorHandler';
import { MQTTService } from '../services/MQTTService';

const createDeviceSchema = z.object({
  name: z.string().min(1).max(64),
});

function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

function generateMqttPassword(): string {
  return crypto.randomBytes(24).toString('hex');
}

export async function listDevices(req: Request, res: Response, next: NextFunction) {
  try {
    const devices = await Device.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: devices });
  } catch (err) {
    next(err);
  }
}

export async function createDevice(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = createDeviceSchema.parse(req.body);

    const apiKey = generateApiKey();
    const mqttPassword = generateMqttPassword();
    const mqttPasswordHash = await bcrypt.hash(mqttPassword, 10);

    const device = new Device({
      userId: req.user!.userId,
      name,
      apiKey,
      mqttUsername: 'placeholder', // will be set after _id is known
      mqttPasswordHash,
      mqttTopic: 'placeholder',    // set by pre-save hook
    });

    // Set mqttUsername based on _id (available before save via new ObjectId)
    device.mqttUsername = `device-${device._id.toString()}`;
    await device.save();

    // Add to MQTT service cache
    const mqttService = req.app.get('mqttService') as MQTTService | undefined;
    mqttService?.addToCache(device._id.toString(), device.mqttUsername);

    // Return device + plain text password (shown ONCE)
    const responseData = {
      ...device.toJSON(),
      mqttPassword,       // plain text, shown once
      mqttUsername: device.mqttUsername,
    };

    res.status(201).json({ success: true, data: responseData });
  } catch (err) {
    next(err);
  }
}

export async function deleteDevice(req: Request, res: Response, next: NextFunction) {
  try {
    const device = await Device.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!device) throw createError('Device not found', 404);

    // Remove from MQTT cache
    const mqttService = req.app.get('mqttService') as MQTTService | undefined;
    mqttService?.removeFromCache(device._id.toString());

    // Cascade delete
    await Promise.all([
      device.deleteOne(),
      SensorReading.deleteMany({ deviceId: device._id }),
      DashboardLayout.deleteOne({ deviceId: device._id }),
    ]);

    res.json({ success: true, message: 'Device deleted' });
  } catch (err) {
    next(err);
  }
}

export async function regenApiKey(req: Request, res: Response, next: NextFunction) {
  try {
    const device = await Device.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!device) throw createError('Device not found', 404);

    const newApiKey = generateApiKey();
    const newMqttPassword = generateMqttPassword();
    const newMqttPasswordHash = await bcrypt.hash(newMqttPassword, 10);

    await Device.updateOne(
      { _id: device._id },
      { apiKey: newApiKey, mqttPasswordHash: newMqttPasswordHash }
    );

    res.json({
      success: true,
      data: { apiKey: newApiKey, mqttPassword: newMqttPassword, mqttUsername: device.mqttUsername },
      message: 'Credentials regenerated. Store the new MQTT password — it will not be shown again.',
    });
  } catch (err) {
    next(err);
  }
}
