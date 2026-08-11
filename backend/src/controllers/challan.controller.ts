import { Request, Response, NextFunction } from 'express';
import { ChallanStatus } from '@prisma/client';
import { createChallanSchema } from '../validators/challan.validator';
import * as challanService from '../services/challan.service';
import { ChallanServiceError } from '../services/challan.service';

export const createChallanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = createChallanSchema.safeParse(req.body);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      res.status(400).json({ message: issue ? issue.message : 'Invalid challan data' });
      return;
    }

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const challan = await challanService.createChallan(parseResult.data, req.user.userId);
    res.status(201).json(challan);
  } catch (error) {
    if (error instanceof ChallanServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getChallansHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const search = req.query.search ? (req.query.search as string) : undefined;
    const status = req.query.status ? (req.query.status as ChallanStatus) : undefined;
    const customerId = req.query.customerId ? parseInt(req.query.customerId as string, 10) : undefined;

    const result = await challanService.getChallans({
      page,
      limit,
      search,
      status,
      customerId,
    });

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ChallanServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getChallanByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid challan ID format' });
      return;
    }

    const challan = await challanService.getChallanById(id);
    res.status(200).json(challan);
  } catch (error) {
    if (error instanceof ChallanServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const confirmChallanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid challan ID format' });
      return;
    }

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const confirmedChallan = await challanService.confirmChallan(id, req.user.userId);
    res.status(200).json({
      message: 'Challan confirmed and stock deducted successfully',
      challan: confirmedChallan,
    });
  } catch (error) {
    if (error instanceof ChallanServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const cancelChallanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid challan ID format' });
      return;
    }

    const cancelledChallan = await challanService.cancelChallan(id);
    res.status(200).json({
      message: 'Challan cancelled successfully',
      challan: cancelledChallan,
    });
  } catch (error) {
    if (error instanceof ChallanServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};
