import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`[Server]: API running on port ${config.port} in ${config.nodeEnv} mode`);
});

process.on('unhandledRejection', (reason: Error) => {
  console.error('[Unhandled Rejection]:', reason);
});

process.on('uncaughtException', (error: Error) => {
  console.error('[Uncaught Exception]:', error);
  process.exit(1);
});

export default server;
