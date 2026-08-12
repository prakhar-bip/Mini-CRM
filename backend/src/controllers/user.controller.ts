import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { z } from 'zod';
import * as userService from '../services/user.service';

const createUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
  role: z.nativeEnum(Role, { required_error: 'Valid Role is required' }),
  password: z.string().optional(),
});

export const getUsersHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      res.status(400).json({ message: issue ? issue.message : 'Invalid request data' });
      return;
    }

    const newUser = await userService.createUser(parseResult.data);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create user' });
  }
};

export const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = parseInt(req.params.id, 10);
    if (isNaN(targetUserId)) {
      res.status(400).json({ message: 'Invalid user ID format' });
      return;
    }

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const deleted = await userService.deleteUserById(targetUserId, req.user.userId);
    res.status(200).json({
      message: `User ${deleted.name} (${deleted.email}) deleted successfully`,
      deleted,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to delete user' });
  }
};
