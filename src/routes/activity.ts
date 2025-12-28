// Minor update for documentation
import { Request, Response } from 'express';
import { ActivityEvent } from '../models/ActivityEvent';
import { logger } from '../utils/logger';

export async function getActivity(req: Request, res: Response): Promise<void> {
  try {
    const { address, limit = 50 } = req.query;
    const query: any = { rollback: false };
    if (address) {
      query.addressInvolved = address;
    }

    const events = await ActivityEvent.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json(events);
  } catch (error) {
    logger.error('Error fetching activity', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getActivitySummary(req: Request, res: Response): Promise<void> {
  try {
    const { address } = req.params;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const pipeline = [
      {
        $match: {
          addressInvolved: address,
          rollback: false,
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ];

    const summary = await ActivityEvent.aggregate(pipeline);

    const result = {
      cbtcTransfers: summary.find(s => s._id === 'cbtc-transfer')?.count || 0,
      cnftMints: summary.find(s => s._id === 'cnft-mint')?.count || 0,
      cnftTransfers: summary.find(s => s._id === 'cnft-transfer')?.count || 0,
      profileChanges: (summary.find(s => s._id === 'profile-updated')?.count || 0) + (summary.find(s => s._id === 'profile-cleared')?.count || 0),
    };

    res.json(result);
  } catch (error) {
    logger.error('Error fetching activity summary', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}