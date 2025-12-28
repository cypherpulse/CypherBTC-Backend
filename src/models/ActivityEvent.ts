// Minor update for documentation
import mongoose, { Schema, Document } from 'mongoose';

export type EventType = 'profile-updated' | 'profile-cleared' | 'cbtc-mint' | 'cbtc-transfer' | 'cnft-mint' | 'cnft-transfer';

export interface IActivityEvent extends Document {
  _id: mongoose.Types.ObjectId;
  txid: string;
  blockHeight: number;
  blockHash: string;
  timestamp: Date;
  contractId: string;
  eventType: EventType;
  from?: string;
  to?: string;
  amount?: string;
  tokenId?: string;
  displayName?: string;
  addressInvolved: string[];
  rollback: boolean;
}

const ActivityEventSchema = new Schema<IActivityEvent>({
  txid: { type: String, required: true },
  blockHeight: { type: Number, required: true },
  blockHash: { type: String, required: true },
  timestamp: { type: Date, required: true },
  contractId: { type: String, required: true },
  eventType: { type: String, enum: ['profile-updated', 'profile-cleared', 'cbtc-mint', 'cbtc-transfer', 'cnft-mint', 'cnft-transfer'], required: true },
  from: { type: String },
  to: { type: String },
  amount: { type: String },
  tokenId: { type: String },
  displayName: { type: String },
  addressInvolved: { type: [String], required: true },
  rollback: { type: Boolean, default: false },
});

// Indexes
ActivityEventSchema.index({ addressInvolved: 1, timestamp: -1 });
ActivityEventSchema.index({ timestamp: -1 });

export const ActivityEvent = mongoose.model<IActivityEvent>('ActivityEvent', ActivityEventSchema);