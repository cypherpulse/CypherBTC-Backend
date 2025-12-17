# CypherBTC Backend

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Stacks](https://img.shields.io/badge/Stacks-5546FF?logo=stack&logoColor=white)](https://stacks.co/)

A robust, production-ready backend service for the CypherPBTC dApp built on the Stacks blockchain. This service efficiently handles real-time event ingestion from Hiro Chainhooks, persists structured activity data in MongoDB, and provides high-performance REST APIs for frontend consumption.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Chainhook Integration](#chainhook-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Contributing](#contributing)
- [License](#license)

## Overview

The CypherBTC Backend serves as the data layer for the CypherPBTC decentralized application, bridging on-chain Stacks contract events with off-chain data persistence and API access. It processes webhook notifications from Hiro Chainhooks, normalizes blockchain events into a unified schema, and exposes clean REST endpoints for activity feeds and user-specific data.

## Features

- **Real-time Event Ingestion**: Processes Hiro Chainhooks webhooks for Stacks contracts with sub-second latency
- **Data Persistence**: Stores normalized activity events in MongoDB with optimized indexing
- **RESTful APIs**: Provides paginated, filtered endpoints for activity data and user summaries
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Production Ready**: Comprehensive logging, error handling, and health checks
- **Scalable Architecture**: Modular design supporting horizontal scaling
- **Security**: Webhook authentication and input validation
- **Real-time Optional**: WebSocket support for live activity feeds

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Hiro Chain    │────│  Chainhook Web   │────│   Express App   │
│    hooks        │    │     hook         │    │                 │
└─────────────────┘    └──────────────────┘    │                 │
                                              │  ┌────────────┐ │
                                              │  │ Validators │ │
                                              │  └────────────┘ │
                                              │                 │
                                              │  ┌────────────┐ │
                                              │  │  Services  │ │
                                              │  └────────────┘ │
                                              │                 │
                                              │  ┌────────────┐ │
                                              │  │   Models   │ │
                                              │  └────────────┘ │
                                              │                 │
┌─────────────────┐    ┌──────────────────┐    │  ┌────────────┐ │
│   Frontend      │◄───│    REST APIs     │◄───│  │   MongoDB  │ │
│                 │    │                  │    │  └────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Tech Stack

- **Language**: TypeScript 5.3+
- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB 7+ with Mongoose ODM
- **Validation**: Zod 3.22+
- **Logging**: Winston 3.11+
- **Configuration**: dotenv 16.3+
- **Testing**: Jest 29.7+
- **Linting**: ESLint with TypeScript rules

## Prerequisites

- Node.js 20 or higher
- MongoDB 7.0 or higher (local or Atlas)
- npm or yarn package manager
- Hiro Chainhooks account for webhook setup

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/cypherbtc-backend.git
   cd cypherbtc-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod

   # Or use MongoDB Atlas and update MONGODB_URI
   ```

5. **Development run**
   ```bash
   npm run dev
   ```

6. **Production build**
   ```bash
   npm run build
   npm start
   ```

## Configuration

Create a `.env` file based on `.env.example`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=cypherbtc

# Server
PORT=3000

# Security
CHAINHOOK_SECRET=your-secure-webhook-secret

# Network
STACKS_NETWORK=testnet

# Contract IDs
PROFILES_CONTRACT_ID=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.profiles
CYPHer_BTC_TOKEN_CONTRACT_ID=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cypher-btc-token
CYPHer_COLLECTIBLES_CONTRACT_ID=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cypher-collectibles
```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `MONGODB_DB_NAME` | Database name | Yes | - |
| `PORT` | Server port | No | 3000 |
| `CHAINHOOK_SECRET` | Webhook authentication secret | Yes | - |
| `STACKS_NETWORK` | Stacks network (testnet/mainnet) | No | testnet |
| `PROFILES_CONTRACT_ID` | Profiles contract identifier | Yes | - |
| `CYPHer_BTC_TOKEN_CONTRACT_ID` | CypherBTC token contract | Yes | - |
| `CYPHer_COLLECTIBLES_CONTRACT_ID` | CypherCollectibles contract | Yes | - |

## Usage

### Development

```bash
npm run dev
```

The server will start on `http://localhost:3000` with hot reload enabled.

### Production

```bash
npm run build
npm start
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

## API Reference

### Authentication

Webhook endpoints require the `X-CHAINHOOK-SECRET` header matching the configured secret.

### Endpoints

#### POST /webhooks/chainhook

Ingests Chainhook webhook payloads and persists events.

**Headers:**
- `X-CHAINHOOK-SECRET`: Authentication secret
- `Content-Type`: application/json

**Request Body:**
```json
{
  "apply": [
    {
      "block": {
        "block_height": 12345,
        "block_hash": "0x...",
        "burn_block_time": 1700000000
      },
      "transactions": [
        {
          "tx": {
            "txid": "0x...",
            "block_height": 12345,
            "block_hash": "0x...",
            "burn_block_time": 1700000000
          },
          "events": [
            {
              "type": "ft_transfer",
              "asset_identifier": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cypher-btc-token",
              "sender": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
              "recipient": "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
              "amount": "1000000"
            }
          ]
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized (invalid secret)
- `400`: Bad Request (invalid payload)
- `500`: Internal Server Error

#### GET /api/activity

Retrieves paginated activity events.

**Query Parameters:**
- `address` (optional): Filter by Stacks address
- `limit` (optional): Number of events to return (default: 50, max: 100)

**Example:**
```bash
GET /api/activity?address=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM&limit=20
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "txid": "0x123...",
    "blockHeight": 12345,
    "blockHash": "0xabc...",
    "timestamp": "2025-12-17T10:00:00.000Z",
    "contractId": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cypher-btc-token",
    "eventType": "cbtc-transfer",
    "from": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    "to": "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
    "amount": "1000000",
    "addressInvolved": ["ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM", "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"],
    "rollback": false
  }
]
```

#### GET /api/activity/summary/{address}

Gets activity summary for a specific address.

**Path Parameters:**
- `address`: Stacks address

**Example:**
```bash
GET /api/activity/summary/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

**Response:**
```json
{
  "cbtcTransfers": 5,
  "cnftMints": 2,
  "cnftTransfers": 3,
  "profileChanges": 1
}
```

#### GET /api/health

Service health check.

**Response:**
```json
{
  "status": "healthy",
  "mongodb": "ok",
  "uptime": 3600
}
```

## Chainhook Integration

### Setting up Chainhooks

1. **Access Hiro Chainhooks Dashboard**
   Navigate to your Hiro Chainhooks account dashboard.

2. **Create Predicate**
   ```json
   {
     "name": "CypherBTC Activity Monitor",
     "chain": "stacks",
     "network": "testnet",
     "predicate": {
       "type": "block",
       "scope": "contract_call",
       "contract_identifiers": [
         "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.profiles",
         "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cypher-btc-token",
         "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cypher-collectibles"
       ]
     }
   }
   ```

3. **Configure Webhook**
   - URL: `https://your-domain.com/webhooks/chainhook`
   - Secret: Your configured `CHAINHOOK_SECRET`
   - Headers: `X-CHAINHOOK-SECRET: {secret}`

4. **Test Webhook**
   Use the Hiro dashboard to send test events.

### Supported Events

- `profile-updated`: User profile changes
- `profile-cleared`: Profile deletions
- `cbtc-mint`: CypherBTC token minting
- `cbtc-transfer`: CypherBTC transfers
- `cnft-mint`: CypherCollectible minting
- `cnft-transfer`: NFT transfers

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### Manual Testing with cURL

**Health Check:**
```bash
curl -X GET http://localhost:3000/api/health
```

**Activity Feed:**
```bash
curl -X GET "http://localhost:3000/api/activity?limit=10"
```

**Webhook Test:**
```bash
curl -X POST http://localhost:3000/webhooks/chainhook \
  -H "Content-Type: application/json" \
  -H "X-CHAINHOOK-SECRET: your-secret" \
  -d @test/webhook-payload.json
```

### Postman Collection

Import `test/CypherBTC_Backend.postman_collection.json` for comprehensive API testing.

## Deployment

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t cypherbtc-backend .
docker run -p 3000:3000 --env-file .env cypherbtc-backend
```

### Kubernetes

See `k8s/` directory for deployment manifests.

### Environment-Specific Configs

- **Development**: `.env.development`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

## Monitoring

### Logging

Logs are written to:
- Console (development)
- `logs/error.log` (errors)
- `logs/combined.log` (all logs)

### Metrics

- Request latency
- Error rates
- Database connection status
- Webhook processing throughput

### Health Checks

The `/api/health` endpoint provides:
- MongoDB connectivity
- Service uptime
- Memory usage

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Verify `MONGODB_URI` is correct
- Check MongoDB is running
- Ensure network connectivity

**Webhook Authentication Failed**
- Confirm `CHAINHOOK_SECRET` matches Hiro configuration
- Check header casing: `X-CHAINHOOK-SECRET`

**Invalid Contract Events**
- Update contract IDs in environment variables
- Verify contract deployment on correct network

### Debug Mode

Enable debug logging:
```bash
DEBUG=cypherbtc:* npm run dev
```

## Security

- Webhook endpoints require authentication
- Input validation with Zod schemas
- No sensitive data in logs
- Rate limiting recommended for production
- HTTPS required for webhook endpoints

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Update documentation
- Use conventional commits

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the Stacks ecosystem