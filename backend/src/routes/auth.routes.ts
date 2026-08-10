import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  login,
  getMe,
  testAdmin,
  testSales,
  testWarehouse,
  testAccounts,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Public auth endpoints
router.post('/login', login);

// Authenticated current user endpoint
router.get('/me', authenticate, getMe);

// Protected development test endpoints for role verification
router.get('/test/admin', authenticate, requireRole(Role.ADMIN), testAdmin);
router.get('/test/sales', authenticate, requireRole(Role.SALES), testSales);
router.get('/test/warehouse', authenticate, requireRole(Role.WAREHOUSE), testWarehouse);
router.get('/test/accounts', authenticate, requireRole(Role.ACCOUNTS), testAccounts);

export default router;
