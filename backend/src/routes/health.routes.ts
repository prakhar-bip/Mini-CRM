import { Router, Request, Response } from 'express';
import { config } from '../config/env';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Wholesale Mini ERP + CRM Operations Portal API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

export default router;
