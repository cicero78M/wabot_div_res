import {
  fetchTaskDeliveryRecap,
  fetchDailyReport,
  fetchWeeklyReport,
  fetchMonthlyReport
} from './repository.js';
import { enqueueOutboundMessage } from '../../services/outbox.js';

export const runTaskDeliveryRecap = async ({ db, logger, waGateway }) => {
  const recaps = await fetchTaskDeliveryRecap({ db });
  await enqueueOutboundMessage({ db, recaps, type: 'task_delivery_recap' });
  await waGateway.dispatchPendingMessages();
  logger.info({ count: recaps.length }, 'Task delivery recap enqueued');
};

export const runDailyReport = async ({ db, logger, waGateway }) => {
  const reports = await fetchDailyReport({ db });
  await enqueueOutboundMessage({ db, recaps: reports, type: 'daily_report' });
  await waGateway.dispatchPendingMessages();
  logger.info({ count: reports.length }, 'Daily report enqueued');
};

export const runWeeklyReport = async ({ db, logger, waGateway }) => {
  const reports = await fetchWeeklyReport({ db });
  await enqueueOutboundMessage({ db, recaps: reports, type: 'weekly_report' });
  await waGateway.dispatchPendingMessages();
  logger.info({ count: reports.length }, 'Weekly report enqueued');
};

export const runMonthlyReport = async ({ db, logger, waGateway }) => {
  const reports = await fetchMonthlyReport({ db });
  await enqueueOutboundMessage({ db, recaps: reports, type: 'monthly_report' });
  await waGateway.dispatchPendingMessages();
  logger.info({ count: reports.length }, 'Monthly report enqueued');
};
