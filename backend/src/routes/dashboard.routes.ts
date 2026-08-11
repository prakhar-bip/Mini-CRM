import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getDashboardStatsHandler } from '../controllers/dashboard.controller';

const router = Router();

router.get('/stats', authenticate, getDashboardStatsHandler);

export default router;
