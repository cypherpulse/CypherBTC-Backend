import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../utils/logger';

export async function connectMongoDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri, {
      dbName: config.dbName,
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

export async function disconnectMongoDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Failed to disconnect from MongoDB', error);
  }
}