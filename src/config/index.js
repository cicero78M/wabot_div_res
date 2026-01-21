export const initConfig = () => {
  const required = [
    'DATABASE_URL',
    'WA_AUTH_PATH',
    'WA_PUPPETEER_ARGS',
    'WA_SESSION_NAME'
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};
