import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import '../types/express';
import { loginUser, getUserById, AuthError } from '../services/auth.service';

const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      res.status(400).json({
        message: issue ? issue.message : 'Invalid request payload',
      });
      return;
    }

    const { email, password } = parseResult.data;
    const result = await loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }

    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const user = await getUserById(req.user.userId);

    res.status(200).json({
      user,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }

    next(error);
  }
};

export const testAdmin = (_req: Request, res: Response): void => {
  res.status(200).json({ message: 'Admin access granted' });
};

export const testSales = (_req: Request, res: Response): void => {
  res.status(200).json({ message: 'Sales access granted' });
};

export const testWarehouse = (_req: Request, res: Response): void => {
  res.status(200).json({ message: 'Warehouse access granted' });
};

export const testAccounts = (_req: Request, res: Response): void => {
  res.status(200).json({ message: 'Accounts access granted' });
};
