import { Request, Response, NextFunction } from 'express';
import { CustomerType, CustomerStatus } from '@prisma/client';
import {
  createCustomerSchema,
  updateCustomerSchema,
  createFollowUpSchema,
} from '../validators/customer.validator';
import * as customerService from '../services/customer.service';
import { CustomerServiceError } from '../services/customer.service';

export const createCustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = createCustomerSchema.safeParse(req.body);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      res.status(400).json({ message: issue ? issue.message : 'Invalid customer data' });
      return;
    }

    const newCustomer = await customerService.createCustomer(parseResult.data as any);
    res.status(201).json(newCustomer);
  } catch (error) {
    if (error instanceof CustomerServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getCustomersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const search = req.query.search ? (req.query.search as string) : undefined;
    const status = req.query.status ? (req.query.status as CustomerStatus) : undefined;
    const customerType = req.query.customerType ? (req.query.customerType as CustomerType) : undefined;

    const result = await customerService.getCustomers({
      page,
      limit,
      search,
      status,
      customerType,
    });

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof CustomerServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getCustomerByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid customer ID format' });
      return;
    }

    const customer = await customerService.getCustomerById(id);
    res.status(200).json(customer);
  } catch (error) {
    if (error instanceof CustomerServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const updateCustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid customer ID format' });
      return;
    }

    const parseResult = updateCustomerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      res.status(400).json({ message: issue ? issue.message : 'Invalid update data' });
      return;
    }

    const updatedCustomer = await customerService.updateCustomer(id, parseResult.data as any);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    if (error instanceof CustomerServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const createFollowUpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      res.status(400).json({ message: 'Invalid customer ID format' });
      return;
    }

    const parseResult = createFollowUpSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      res.status(400).json({ message: issue ? issue.message : 'Invalid follow-up note' });
      return;
    }

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const followUp = await customerService.addFollowUp(
      customerId,
      req.user.userId,
      parseResult.data.note
    );

    res.status(201).json(followUp);
  } catch (error) {
    if (error instanceof CustomerServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getFollowUpsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      res.status(400).json({ message: 'Invalid customer ID format' });
      return;
    }

    const followUps = await customerService.getFollowUps(customerId);
    res.status(200).json(followUps);
  } catch (error) {
    if (error instanceof CustomerServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};
