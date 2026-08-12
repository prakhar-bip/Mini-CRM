import { Router } from 'express';
import { Role } from '@prisma/client';
import { getUsersHandler, createUserHandler, deleteUserHandler } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

// List all users - accessible to authenticated employees
router.get('/', getUsersHandler);

// Admin-only route to create user
router.post('/', requireRole(Role.ADMIN), createUserHandler);

// Admin-only route to delete user
router.delete('/:id', requireRole(Role.ADMIN), deleteUserHandler);

export default router;
