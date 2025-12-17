import { ChainhookBlock, ChainhookEvent, ChainhookTransaction } from '../utils/validators';
import { IActivityEvent, EventType } from '../models/ActivityEvent';
import { config } from '../config';

export function normalizeEvents(block: ChainhookBlock): IActivityEvent[] {
  const events: IActivityEvent[] = [];

  for (const tx of block.transactions) {
    for (const event of tx.events) {
      const normalized = normalizeEvent(event, tx, block);
      if (normalized) {
        events.push(normalized);
      }
    }
  }

  return events;
}

function normalizeEvent(event: ChainhookEvent, tx: ChainhookTransaction, block: ChainhookBlock): IActivityEvent | null {
  const base = {
    txid: tx.tx.txid,
    blockHeight: block.block.block_height,
    blockHash: block.block.block_hash,
    timestamp: new Date(block.block.burn_block_time * 1000),
    rollback: false,
  };

  switch (event.type) {
    case 'smart_contract_log':
      return handleSmartContractLog(event, base);
    case 'ft_transfer':
      return handleFtTransfer(event, base);
    case 'nft_transfer':
      return handleNftTransfer(event, base);
    case 'ft_mint':
      return handleFtMint(event, base);
    case 'nft_mint':
      return handleNftMint(event, base);
    // Add more cases as needed
    default:
      return null;
  }
}

function handleSmartContractLog(event: ChainhookEvent, base: Partial<IActivityEvent>): IActivityEvent | null {
  if (!event.contract_id || !event.topic) return null;

  const contractId = event.contract_id;
  let eventType: EventType | null = null;
  let displayName: string | undefined;
  let addressInvolved: string[] = [];

  if (contractId === config.contracts.profiles) {
    if (event.topic === 'profile-updated') {
      eventType = 'profile-updated';
      // Parse value for displayName
      displayName = event.value?.displayName;
      addressInvolved = [event.value?.address];
    } else if (event.topic === 'profile-cleared') {
      eventType = 'profile-cleared';
      addressInvolved = [event.value?.address];
    }
  }

  if (!eventType) return null;

  return {
    ...base,
    contractId,
    eventType,
    displayName,
    addressInvolved,
  } as IActivityEvent;
}

function handleFtTransfer(event: ChainhookEvent, base: Partial<IActivityEvent>): IActivityEvent | null {
  if (event.asset_identifier !== config.contracts.cypherBtcToken) return null;

  return {
    ...base,
    contractId: event.asset_identifier!,
    eventType: 'cbtc-transfer',
    from: event.sender,
    to: event.recipient,
    amount: event.amount,
    addressInvolved: [event.sender!, event.recipient!],
  } as IActivityEvent;
}

function handleNftTransfer(event: ChainhookEvent, base: Partial<IActivityEvent>): IActivityEvent | null {
  if (event.asset_identifier !== config.contracts.cypherCollectibles) return null;

  return {
    ...base,
    contractId: event.asset_identifier!,
    eventType: 'cnft-transfer',
    from: event.sender,
    to: event.recipient,
    tokenId: event.token_id,
    addressInvolved: [event.sender!, event.recipient!],
  } as IActivityEvent;
}

function handleFtMint(event: ChainhookEvent, base: Partial<IActivityEvent>): IActivityEvent | null {
  if (event.asset_identifier !== config.contracts.cypherBtcToken) return null;

  return {
    ...base,
    contractId: event.asset_identifier!,
    eventType: 'cbtc-mint',
    to: event.recipient,
    amount: event.amount,
    addressInvolved: [event.recipient!],
  } as IActivityEvent;
}

function handleNftMint(event: ChainhookEvent, base: Partial<IActivityEvent>): IActivityEvent | null {
  if (event.asset_identifier !== config.contracts.cypherCollectibles) return null;

  return {
    ...base,
    contractId: event.asset_identifier!,
    eventType: 'cnft-mint',
    to: event.recipient,
    tokenId: event.token_id,
    addressInvolved: [event.recipient!],
  } as IActivityEvent;
}