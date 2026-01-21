import { fetchPendingComplaints, markComplaintResponded } from './repository.js';
import { enqueueOutboundMessage } from '../../services/outbox.js';

export const handleComplaintResponses = async ({ db, logger, waGateway }) => {
  const complaints = await fetchPendingComplaints({ db });
  if (complaints.length === 0) {
    return;
  }

  await enqueueOutboundMessage({ db, recaps: complaints, type: 'complaint_response' });
  await waGateway.dispatchPendingMessages();

  for (const complaint of complaints) {
    await markComplaintResponded({ db, complaintId: complaint.id });
  }

  logger.info({ count: complaints.length }, 'Complaint responses processed');
};
