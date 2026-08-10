import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  createCustomerHandler,
  getCustomersHandler,
  getCustomerByIdHandler,
  updateCustomerHandler,
  createFollowUpHandler,
  getFollowUpsHandler,
} from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Apply authentication to all customer routes
router.use(authenticate);

// Customer CRUD routes
router.post(
  '/',
  requireRole(Role.ADMIN, Role.SALES),
  createCustomerHandler
);

router.get(
  '/',
  requireRole(Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS),
  getCustomersHandler
);

router.get(
  '/:id',
  requireRole(Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS),
  getCustomerByIdHandler
);

router.put(
  '/:id',
  requireRole(Role.ADMIN, Role.SALES),
  updateCustomerHandler
);

// Customer Follow-up routes
router.post(
  '/:id/followups',
  requireRole(Role.ADMIN, Role.SALES),
  createFollowUpHandler
);

router.get(
  '/:id/followups',
  requireRole(Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS),
  getFollowUpsHandler
);

export default router;
