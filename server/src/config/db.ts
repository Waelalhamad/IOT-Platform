import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export async function connectDB(retries = MAX_RETRIES): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI, {
      bufferCommands: false,
      autoIndex: env.NODE_ENV !== 'production',
    });
    logger.info('✅ MongoDB connected');
  } catch (error) {
    if (retries > 0) {
      logger.warn(`MongoDB connection failed. Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries} retries left)`);
      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(retries - 1);
    }
    logger.error('❌ MongoDB connection failed after all retries', error);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB error:', err);
  });
}
