import qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger();

let clientInstance = null;
let clientInitialized = false;

const getPuppeteerArgs = () => {
  const rawArgs = process.env.WA_PUPPETEER_ARGS;
  if (!rawArgs) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawArgs);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    logger.warn({ err: error }, 'Failed to parse WA_PUPPETEER_ARGS as JSON array');
  }

  return rawArgs.split(',').map((arg) => arg.trim()).filter(Boolean);
};

const createClient = () => {
  const sessionName = process.env.WA_SESSION_NAME;
  const authPath = process.env.WA_AUTH_PATH;

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: sessionName,
      dataPath: authPath
    }),
    puppeteer: {
      args: getPuppeteerArgs()
    }
  });

  client.on('qr', (qr) => {
    logger.info('QR received. Scan to pair WhatsApp Web.');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    logger.info('WhatsApp client ready');
  });

  client.on('authenticated', () => {
    logger.info('WhatsApp client authenticated');
  });

  client.on('auth_failure', (message) => {
    logger.error({ message }, 'WhatsApp authentication failed');
  });

  client.on('disconnected', (reason) => {
    logger.warn({ reason }, 'WhatsApp client disconnected');
  });

  return client;
};

export const initWaClient = async () => {
  if (!clientInstance) {
    clientInstance = createClient();
  }

  if (!clientInitialized) {
    clientInitialized = true;
    await clientInstance.initialize();
  }

  return clientInstance;
};

export const sendMessage = async (message) => {
  if (!message.recipient || !message.content) {
    throw new Error('Invalid message payload');
  }

  if (!clientInstance) {
    throw new Error('WhatsApp client not initialized');
  }

  return clientInstance.sendMessage(message.recipient, message.content);
};
