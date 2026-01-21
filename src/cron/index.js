import cron from 'node-cron';
import {
  runDailyReport,
  runWeeklyReport,
  runMonthlyReport,
  runTaskDeliveryRecap
} from '../modules/rekap/index.js';
import { handleComplaintResponses } from '../modules/complaints/index.js';

export const registerCronJobs = ({ db, logger, waGateway }) => {
  const dailyReportCron = process.env.DAILY_REPORT_CRON || '0 7 * * *';
  const weeklyReportCron = process.env.WEEKLY_REPORT_CRON || '0 7 * * 1';
  const monthlyReportCron = process.env.MONTHLY_REPORT_CRON || '0 7 1 * *';
  const taskDeliveryRecapCron =
    process.env.TASK_DELIVERY_RECAP_CRON || '*/30 * * * *';
  const complaintResponseCron =
    process.env.COMPLAINT_RESPONSE_CRON || '*/5 * * * *';
  const waGatewayPollCron = process.env.WA_GATEWAY_POLL_CRON || '*/2 * * * *';

  logger.info(
    { schedule: waGatewayPollCron },
    'Registering WA gateway polling cron'
  );

  cron.schedule(dailyReportCron, async () => {
    logger.info('Running daily report cron');
    await runDailyReport({ db, logger, waGateway });
  });

  cron.schedule(weeklyReportCron, async () => {
    logger.info('Running weekly report cron');
    await runWeeklyReport({ db, logger, waGateway });
  });

  cron.schedule(monthlyReportCron, async () => {
    logger.info('Running monthly report cron');
    await runMonthlyReport({ db, logger, waGateway });
  });

  cron.schedule(taskDeliveryRecapCron, async () => {
    logger.info('Running task delivery recap cron');
    await runTaskDeliveryRecap({ db, logger, waGateway });
  });

  cron.schedule(complaintResponseCron, async () => {
    logger.info('Running complaint response cron');
    await handleComplaintResponses({ db, logger, waGateway });
  });

  cron.schedule(waGatewayPollCron, async () => {
    logger.info(
      { schedule: waGatewayPollCron },
      'Running WA gateway polling cron'
    );
    await waGateway.dispatchPendingMessages();
  });
};
