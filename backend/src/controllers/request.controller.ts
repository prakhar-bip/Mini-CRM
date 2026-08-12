import { Request, Response, NextFunction } from 'express';
import { Role, RequestStatus } from '@prisma/client';
import { z } from 'zod';
import * as requestService from '../services/request.service';

const createRequestSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(2, 'Title must be at least 2 characters'),
  description: z.string({ required_error: 'Description is required' }).min(2, 'Description must be at least 2 characters'),
  category: z.string({ required_error: 'Category is required' }),
  targetRole: z.nativeEnum(Role, { required_error: 'Target department is required' }),
});

export const createRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = createRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      res.status(400).json({ message: issue ? issue.message : 'Invalid request payload' });
      return;
    }

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const newReq = await requestService.createRequest({
      ...parseResult.data,
      requestedById: req.user.userId,
    });

    res.status(201).json({ message: 'Approval request submitted successfully', request: newReq });
  } catch (error) {
    next(error);
  }
};

export const getRequestsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const result = await requestService.getRequestsForUser(req.user.userId, req.user.role);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const approveRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid request ID' });
      return;
    }

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { reviewNote } = req.body;
    const updated = await requestService.updateRequestStatus(
      id,
      RequestStatus.APPROVED,
      req.user.userId,
      req.user.role,
      reviewNote
    );

    res.status(200).json({ message: 'Request APPROVED successfully', request: updated });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to approve request' });
  }
};

export const rejectRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid request ID' });
      return;
    }

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { reviewNote } = req.body;
    const updated = await requestService.updateRequestStatus(
      id,
      RequestStatus.REJECTED,
      req.user.userId,
      req.user.role,
      reviewNote
    );

    res.status(200).json({ message: 'Request REJECTED', request: updated });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to reject request' });
  }
};
