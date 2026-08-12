import { Router } from 'express';
import { downloadReportHandler } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Download report endpoint - accessible to authenticated users with report access
router.get('/download', downloadReportHandler);

export default router;
