import { z } from 'zod';
import { StockMovementType } from '@prisma/client';

export const createProductSchema = z.object({
  name: z.string({ required_error: 'Product name is required' }).min(2, 'Name must be at least 2 characters'),
  sku: z.string({ required_error: 'SKU is required' }).min(2, 'SKU must be at least 2 characters'),
  category: z.string({ required_error: 'Category is required' }).min(2, 'Category must be at least 2 characters'),
  unitPrice: z.coerce.number({ required_error: 'Unit price is required' }).positive('Unit price must be greater than 0'),
  currentStock: z.coerce.number().int('Stock must be an integer').min(0, 'Stock cannot be negative').optional().default(0),
  minimumStock: z.coerce.number().int('Minimum stock must be an integer').min(0, 'Minimum stock cannot be negative').optional().default(0),
  warehouseLocation: z.string({ required_error: 'Warehouse location is required' }).min(2, 'Warehouse location must be at least 2 characters'),
});

export const updateProductSchema = createProductSchema.partial();

export const createStockMovementSchema = z.object({
  quantity: z.coerce.number({ required_error: 'Quantity is required' }).int('Quantity must be an integer').positive('Quantity must be greater than 0'),
  type: z.nativeEnum(StockMovementType, {
    errorMap: () => ({ message: 'Invalid movement type. Must be IN or OUT' }),
  }),
  reason: z.string({ required_error: 'Reason is required' }).min(2, 'Reason must be at least 2 characters'),
});
