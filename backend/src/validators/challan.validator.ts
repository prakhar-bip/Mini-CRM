import { z } from 'zod';
import { ChallanStatus } from '@prisma/client';

export const challanItemInputSchema = z.object({
  productId: z.coerce.number({ required_error: 'Product ID is required' }).int().positive('Product ID must be a positive integer'),
  quantity: z.coerce.number({ required_error: 'Quantity is required' }).int('Quantity must be an integer').positive('Quantity must be greater than 0'),
});

export const createChallanSchema = z.object({
  customerId: z.coerce.number({ required_error: 'Customer ID is required' }).int().positive('Customer ID must be a positive integer'),
  challanNumber: z.string().min(2, 'Challan number must be at least 2 characters').optional(),
  items: z
    .array(challanItemInputSchema)
    .min(1, 'At least one item is required in the challan'),
});

export const updateChallanStatusSchema = z.object({
  status: z.nativeEnum(ChallanStatus, {
    errorMap: () => ({ message: 'Invalid status. Must be DRAFT, CONFIRMED, or CANCELLED' }),
  }),
});
