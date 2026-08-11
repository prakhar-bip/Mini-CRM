import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  createChallanHandler,
  getChallansHandler,
  getChallanByIdHandler,
  confirmChallanHandler,
  cancelChallanHandler,
} from '../controllers/challan.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Apply authentication to all challan routes
router.use(authenticate);

// Sales Challan routes
router.post(
  '/',
  requireRole(Role.ADMIN, Role.SALES),
  createChallanHandler
);

router.get(
  '/',
  requireRole(Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS),
  getChallansHandler
);

router.get(
  '/:id',
  requireRole(Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS),
  getChallanByIdHandler
);

router.put(
  '/:id/confirm',
  requireRole(Role.ADMIN, Role.SALES),
  confirmChallanHandler
);

router.put(
  '/:id/cancel',
  requireRole(Role.ADMIN, Role.SALES),
  cancelChallanHandler
);

export default router;
