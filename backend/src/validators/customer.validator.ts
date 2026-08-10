import { z } from 'zod';
import { CustomerType, CustomerStatus } from '@prisma/client';

export const createCustomerSchema = z.object({
  name: z.string({ required_error: 'Customer name is required' }).min(2, 'Name must be at least 2 characters'),
  mobile: z
    .string({ required_error: 'Mobile number is required' })
    .regex(/^[0-9]{10}$/, 'Mobile number must be a valid 10-digit Indian number'),
  email: z.string().email('Invalid email address format').optional().or(z.literal('')),
  businessName: z.string({ required_error: 'Business name is required' }).min(2, 'Business name must be at least 2 characters'),
  gstNumber: z.string().optional().or(z.literal('')),
  customerType: z.nativeEnum(CustomerType, {
    errorMap: () => ({ message: 'Invalid customerType. Must be RETAIL, WHOLESALE, or DISTRIBUTOR' }),
  }),
  address: z.string({ required_error: 'Address is required' }).min(3, 'Address must be at least 3 characters'),
  status: z
    .nativeEnum(CustomerStatus, {
      errorMap: () => ({ message: 'Invalid status. Must be LEAD, ACTIVE, or INACTIVE' }),
    })
    .optional()
    .default(CustomerStatus.LEAD),
  followUpDate: z
    .string()
    .datetime({ message: 'Invalid followUpDate format. Must be an ISO date string' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'))
    .optional()
    .or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const createFollowUpSchema = z.object({
  note: z.string({ required_error: 'Follow-up note is required' }).min(1, 'Note cannot be empty'),
});
