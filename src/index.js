import { initConfig } from './config/index.js';
import { createLogger } from './utils/logger.js';
import { connectDatabase } from './db/index.js';
import { registerCronJobs } from './cron/index.js';
import { createWAGateway } from './modules/wa-gateway/index.js';

const logger = createLogger();

const bootstrap = async () => {
  initConfig();
  const db = await connectDatabase();
  const waGateway = createWAGateway({ db, logger });

  registerCronJobs({ db, logger, waGateway });

  logger.info('Cicero_V2 backend started');
};

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Failed to start backend');
  process.exit(1);
});
