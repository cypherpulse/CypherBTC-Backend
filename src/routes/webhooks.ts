import { Request, Response } from 'express';
import { ChainhookPayloadSchema } from '../utils/validators';
import { normalizeEvents } from '../services/chainhook';
import { ActivityEvent } from '../models/ActivityEvent';
import { config } from '../config';
import { logger } from '../utils/logger';

export async function handleChainhookWebhook(req: Request, res: Response): Promise<void> {
  try {
    // Check secret
    const secret = req.headers['x-chainhook-secret'];
    if (secret !== config.chainhookSecret) {
      logger.warn('Invalid chainhook secret');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate payload
    const payload = ChainhookPayloadSchema.parse(req.body);

    // Handle apply
    if (payload.apply) {
      for (const block of payload.apply) {
        const events = normalizeEvents(block);
        if (events.length > 0) {
          await ActivityEvent.insertMany(events);
          logger.info(`Inserted ${events.length} events for block ${block.block.block_height}`);
        }
      }
    }

    // Handle rollback
    if (payload.rollback) {
      for (const block of payload.rollback) {
        // Mark events as rollback
        await ActivityEvent.updateMany(
          { blockHeight: block.block.block_height, rollback: false },
          { rollback: true }
        );
        logger.info(`Marked events as rollback for block ${block.block.block_height}`);
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logger.error('Error handling chainhook webhook', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}