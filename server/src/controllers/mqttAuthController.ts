import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Device } from '../models/Device';
import { env } from '../config/env';
import { logger } from '../config/logger';

function checkSecret(req: Request, res: Response): boolean {
  const secret = req.headers['x-emqx-secret'];
  if (secret !== env.EMQX_AUTH_SECRET) {
    logger.warn('MQTT auth attempt with invalid secret');
    res.status(403).json({ result: 'deny' });
    return false;
  }
  return true;
}

export async function mqttAuth(req: Request, res: Response) {
  if (!checkSecret(req, res)) return;

  const { username, password, clientid } = req.body as {
    username: string;
    password: string;
    clientid: string;
  };

  // Backend's own MQTT user — always allow
  if (username === env.MQTT_USERNAME) {
    if (password === env.MQTT_PASSWORD) {
      res.json({ result: 'allow' });
    } else {
      res.json({ result: 'deny' });
    }
    return;
  }

  // Device users: username = "device-{deviceId}"
  if (!username.startsWith('device-')) {
    res.json({ result: 'deny' });
    return;
  }

  try {
    const device = await Device.findOne({ mqttUsername: username }).select('+mqttPasswordHash');
    if (!device) {
      res.json({ result: 'deny' });
      return;
    }

    const valid = await bcrypt.compare(password, device.mqttPasswordHash);
    if (!valid) {
      logger.warn(`Failed MQTT auth for device: ${username} (client: ${clientid})`);
      res.json({ result: 'deny' });
      return;
    }

    logger.debug(`MQTT auth success: ${username}`);
    res.json({ result: 'allow' });
  } catch (err) {
    logger.error('MQTT auth error:', err);
    res.status(500).json({ result: 'deny' });
  }
}

export async function mqttAcl(req: Request, res: Response) {
  if (!checkSecret(req, res)) return;

  const { username, topic, access } = req.body as {
    username: string;
    topic: string;
    access: string; // '1' = subscribe, '2' = publish
  };

  // Backend user can subscribe to everything
  if (username === env.MQTT_USERNAME) {
    res.json({ result: 'allow' });
    return;
  }

  // Device users: can only publish to esp/{their-deviceId}/#
  if (username.startsWith('device-')) {
    const deviceId = username.replace('device-', '');
    const allowedPrefix = `esp/${deviceId}/`;

    if (access === '2' && topic.startsWith(allowedPrefix)) {
      res.json({ result: 'allow' });
    } else if (access === '1') {
      // Devices don't need to subscribe
      res.json({ result: 'deny' });
    } else {
      logger.warn(`ACL deny: ${username} tried to publish to ${topic}`);
      res.json({ result: 'deny' });
    }
    return;
  }

  res.json({ result: 'deny' });
}
