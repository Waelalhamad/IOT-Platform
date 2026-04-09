import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// Load .env only when the file is present (local development).
// In production (Railway), variables are injected directly into process.env.
const envFilePath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
}

const PLACEHOLDER_SECRETS = [
  'changeme', 'replace_this', 'replace_me', 'your_secret',
  'emqx_internal_secret_replace_me',
  'changeme_access_secret_64chars_minimum_please_replace_this',
  'changeme_refresh_secret_64chars_minimum_please_replace_this',
];

const notPlaceholder = (val: string) =>
  !PLACEHOLDER_SECRETS.some((p) => val.toLowerCase().includes(p));

const envSchema = z.object({
  PORT:                     z.string().default('4000').transform(Number),
  NODE_ENV:                 z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI:                z.string().min(1, 'MONGO_URI is required'),
  JWT_ACCESS_SECRET:        z.string().min(32, 'JWT_ACCESS_SECRET must be ≥32 chars'),
  JWT_REFRESH_SECRET:       z.string().min(32, 'JWT_REFRESH_SECRET must be ≥32 chars'),
  JWT_ACCESS_EXPIRES_IN:    z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN:   z.string().default('7d'),
  MQTT_BROKER_URL:          z.string().min(1, 'MQTT_BROKER_URL is required'),
  MQTT_USERNAME:            z.string().min(1),
  MQTT_PASSWORD:            z.string().min(1),
  EMQX_AUTH_SECRET:         z.string().min(16, 'EMQX_AUTH_SECRET must be ≥16 chars'),
  CORS_ORIGIN:              z.string().default('http://localhost:5173'),
  SENSOR_READING_TTL_DAYS:  z.string().default('30').transform(Number),
  COOKIE_SECURE:            z.string().default('false').transform(v => v === 'true'),
  REDIS_URL:                z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const fieldErrors = parsed.error.flatten().fieldErrors;
  const missing = Object.entries(fieldErrors)
    .map(([key, msgs]) => `  ${key}: ${(msgs as string[]).join(', ')}`)
    .join('\n');
  console.error('[env] Environment variable validation failed. Missing or invalid variables:\n' + missing);
  process.exit(1);
}

const data = parsed.data;

// Block placeholder secrets in production
if (data.NODE_ENV === 'production') {
  const secrets: [string, string][] = [
    ['JWT_ACCESS_SECRET',  data.JWT_ACCESS_SECRET],
    ['JWT_REFRESH_SECRET', data.JWT_REFRESH_SECRET],
    ['EMQX_AUTH_SECRET',   data.EMQX_AUTH_SECRET],
    ['MQTT_PASSWORD',      data.MQTT_PASSWORD],
  ];
  for (const [name, val] of secrets) {
    if (!notPlaceholder(val)) {
      console.error(`[env] FATAL: ${name} is a placeholder — replace it before running in production`);
      process.exit(1);
    }
  }
  if (!data.COOKIE_SECURE) {
    console.warn('[env] WARNING: COOKIE_SECURE=false in production — cookies will be sent over HTTP');
  }
}

export const env = data;
export type Env = typeof env;
