import { Router, Request, Response } from 'express';
import { config } from '../config/env';
import { runDatabaseSeed } from '../services/seed.service';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Wholesale Mini ERP + CRM Operations Portal API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

router.all('/seed', async (_req: Request, res: Response) => {
  try {
    await runDatabaseSeed();
    res.status(200).json({
      status: 'ok',
      message: 'Database seeded successfully with demo users, products, customers, and requests!',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err?.message || 'Failed to seed database',
    });
  }
});

export default router;
