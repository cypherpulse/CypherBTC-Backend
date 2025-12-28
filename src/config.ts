// Minor update for documentation
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB_NAME || 'cypherbtc',
  port: parseInt(process.env.PORT || '3000', 10),
  chainhookSecret: process.env.CHAINHOOK_SECRET || '',
  stacksNetwork: process.env.STACKS_NETWORK || 'testnet',
  contracts: {
    profiles: process.env.PROFILES_CONTRACT_ID || '',
    cypherBtcToken: process.env.CYPHer_BTC_TOKEN_CONTRACT_ID || '',
    cypherCollectibles: process.env.CYPHer_COLLECTIBLES_CONTRACT_ID || '',
  },
};