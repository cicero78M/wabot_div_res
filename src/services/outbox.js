export const enqueueOutboundMessage = async ({ db, recaps, type }) => {
  if (!recaps || recaps.length === 0) {
    return;
  }

  const values = [];
  const params = [];
  recaps.forEach((recap, index) => {
    const baseIndex = index * 3;
    params.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`);
    values.push(recap.recipient, recap.summary, type);
  });

  await db.query(
    `INSERT INTO wa_outbox (recipient, content, type)
     VALUES ${params.join(', ')}`,
    values
  );
};
