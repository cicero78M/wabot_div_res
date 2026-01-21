export const sendMessage = async (message) => {
  if (!message.recipient || !message.content) {
    throw new Error('Invalid message payload');
  }

  // Placeholder integration for WA gateway.
  return {
    status: 'queued',
    messageId: message.id
  };
};
