import app from './app';
import { config } from './config/env';
import { runDatabaseSeed } from './services/seed.service';

const server = app.listen(config.port, async () => {
  console.log(`[Server]: API running on port ${config.port} in ${config.nodeEnv} mode`);
  try {
    console.log('[AutoSeed]: Running automatic database check & seed...');
    await runDatabaseSeed();
    console.log('[AutoSeed]: Database successfully verified and seeded!');
  } catch (err) {
    console.error('[AutoSeed Error]: Seeding check failed:', err);
  }
});

process.on('unhandledRejection', (reason: Error) => {
  console.error('[Unhandled Rejection]:', reason);
});

process.on('uncaughtException', (error: Error) => {
  console.error('[Uncaught Exception]:', error);
  process.exit(1);
});

export default server;
