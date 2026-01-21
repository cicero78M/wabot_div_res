export const fetchPendingComplaints = async ({ db }) => {
  const { rows } = await db.query(
    `SELECT id, complainant AS recipient, response_template AS summary
     FROM complaint_queue
     WHERE status = 'pending'
     ORDER BY created_at ASC
     LIMIT 50`
  );
  return rows;
};

export const markComplaintResponded = async ({ db, complaintId }) => {
  await db.query(
    `UPDATE complaint_queue
     SET status = 'responded', responded_at = NOW()
     WHERE id = $1`,
    [complaintId]
  );
};
