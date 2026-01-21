import cron from 'node-cron';
import {
  runDailyReport,
  runWeeklyReport,
  runMonthlyReport,
  runTaskDeliveryRecap
} from '../modules/rekap/index.js';
import { handleComplaintResponses } from '../modules/complaints/index.js';

export const registerCronJobs = ({ db, logger, waGateway }) => {
  cron.schedule('0 7 * * *', async () => {
    logger.info('Running daily report cron');
    await runDailyReport({ db, logger, waGateway });
  });

  cron.schedule('0 7 * * 1', async () => {
    logger.info('Running weekly report cron');
    await runWeeklyReport({ db, logger, waGateway });
  });

  cron.schedule('0 7 1 * *', async () => {
    logger.info('Running monthly report cron');
    await runMonthlyReport({ db, logger, waGateway });
  });

  cron.schedule('*/30 * * * *', async () => {
    logger.info('Running task delivery recap cron');
    await runTaskDeliveryRecap({ db, logger, waGateway });
  });

  cron.schedule('*/5 * * * *', async () => {
    logger.info('Running complaint response cron');
    await handleComplaintResponses({ db, logger, waGateway });
  });
};
