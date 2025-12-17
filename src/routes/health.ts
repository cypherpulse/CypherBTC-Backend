import { Request, Response } from 'express';
import mongoose from 'mongoose';

export async function getHealth(req: Request, res: Response): Promise<void> {
  try {
    // Check MongoDB connection
    const mongoHealth = mongoose.connection.readyState === 1 ? 'ok' : 'error';

    res.json({
      status: mongoHealth === 'ok' ? 'healthy' : 'unhealthy',
      mongodb: mongoHealth,
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: 'Internal server error' });
  }
}