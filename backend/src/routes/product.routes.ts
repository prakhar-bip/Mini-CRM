import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  adjustStockHandler,
  getStockMovementsHandler,
  uploadProductImageHandler,
} from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Apply authentication to all product & inventory routes
router.use(authenticate);

// Product Catalog CRUD routes
router.post(
  '/',
  requireRole(Role.ADMIN, Role.WAREHOUSE),
  createProductHandler
);

router.get(
  '/',
  requireRole(Role.ADMIN, Role.WAREHOUSE, Role.SALES, Role.ACCOUNTS),
  getProductsHandler
);

router.get(
  '/:id',
  requireRole(Role.ADMIN, Role.WAREHOUSE, Role.SALES, Role.ACCOUNTS),
  getProductByIdHandler
);

router.put(
  '/:id',
  requireRole(Role.ADMIN, Role.WAREHOUSE),
  updateProductHandler
);

// Stock / Inventory Movement routes
router.post(
  '/:id/movements',
  requireRole(Role.ADMIN, Role.WAREHOUSE),
  adjustStockHandler
);

router.get(
  '/:id/movements',
  requireRole(Role.ADMIN, Role.WAREHOUSE, Role.SALES, Role.ACCOUNTS),
  getStockMovementsHandler
);

// AWS S3 Product Image Upload route
router.post(
  '/:id/image',
  requireRole(Role.ADMIN, Role.WAREHOUSE),
  uploadProductImageHandler
);

export default router;
