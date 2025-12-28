// Minor update for documentation
import app from './server';
import { connectMongoDB } from './db/mongo';
import { config } from './config';
import { logger } from './utils/logger';

async function startServer() {
  try {
    await connectMongoDB();

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();