import { fetchPendingMessages, markMessageSent } from './repository.js';
import { sendMessage } from '../../services/wa-client.js';

export const createWAGateway = ({ db, logger }) => {
  const dispatchPendingMessages = async () => {
    const messages = await fetchPendingMessages({ db });

    for (const message of messages) {
      try {
        await sendMessage(message);
        await markMessageSent({ db, messageId: message.id });
        logger.info({ messageId: message.id }, 'WA message sent');
      } catch (error) {
        logger.error({ err: error, messageId: message.id }, 'Failed to send WA message');
      }
    }
  };

  return {
    dispatchPendingMessages
  };
};
