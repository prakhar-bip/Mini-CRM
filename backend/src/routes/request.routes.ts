import { Router } from 'express';
import {
  createRequestHandler,
  getRequestsHandler,
  approveRequestHandler,
  rejectRequestHandler,
} from '../controllers/request.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Request endpoints accessible to all authenticated staff roles
router.post('/', createRequestHandler);
router.get('/', getRequestsHandler);
router.put('/:id/approve', approveRequestHandler);
router.put('/:id/reject', rejectRequestHandler);

export default router;
