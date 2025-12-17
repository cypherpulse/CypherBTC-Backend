import { z } from 'zod';

export const ChainhookEventSchema = z.object({
  type: z.enum(['smart_contract_log', 'stx_transfer', 'stx_mint', 'stx_burn', 'ft_transfer', 'ft_mint', 'nft_transfer', 'nft_mint']),
  // Add more fields as needed based on type
  contract_id: z.string().optional(),
  topic: z.string().optional(),
  value: z.any().optional(),
  sender: z.string().optional(),
  recipient: z.string().optional(),
  amount: z.string().optional(),
  asset_identifier: z.string().optional(),
  // For NFT
  token_id: z.string().optional(),
});

export const ChainhookTransactionSchema = z.object({
  tx: z.object({
    txid: z.string(),
    block_height: z.number(),
    block_hash: z.string(),
    burn_block_time: z.number(),
  }),
  events: z.array(ChainhookEventSchema),
});

export const ChainhookBlockSchema = z.object({
  block: z.object({
    block_height: z.number(),
    block_hash: z.string(),
    burn_block_time: z.number(),
  }),
  transactions: z.array(ChainhookTransactionSchema),
});

export const ChainhookPayloadSchema = z.object({
  apply: z.array(ChainhookBlockSchema).optional(),
  rollback: z.array(ChainhookBlockSchema).optional(),
});

export type ChainhookPayload = z.infer<typeof ChainhookPayloadSchema>;
export type ChainhookEvent = z.infer<typeof ChainhookEventSchema>;
export type ChainhookTransaction = z.infer<typeof ChainhookTransactionSchema>;
export type ChainhookBlock = z.infer<typeof ChainhookBlockSchema>;