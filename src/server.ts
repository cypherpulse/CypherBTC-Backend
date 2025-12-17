import express from 'express';
import { handleChainhookWebhook } from './routes/webhooks';
import { getActivity, getActivitySummary } from './routes/activity';
import { getHealth } from './routes/health';
import { logger } from './utils/logger';

const app = express();

app.use(express.json());

// Routes
app.post('/webhooks/chainhook', handleChainhookWebhook);
app.get('/api/activity', getActivity);
app.get('/api/activity/summary/:address', getActivitySummary);
app.get('/api/health', getHealth);

// Optional WebSocket for real-time
// import WebSocket from 'ws';
// const wss = new WebSocket.Server({ server });
// wss.on('connection', (ws) => { ... });

export default app;