export const fetchPendingMessages = async ({ db }) => {
  const { rows } = await db.query(
    `SELECT id, recipient, content
     FROM wa_outbox
     WHERE status = 'pending'
     ORDER BY created_at ASC
     LIMIT 50`
  );
  return rows;
};

export const markMessageSent = async ({ db, messageId }) => {
  await db.query(
    `UPDATE wa_outbox
     SET status = 'sent', sent_at = NOW()
     WHERE id = $1`,
    [messageId]
  );
};
