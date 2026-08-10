import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { loginUser, AuthError } from '../services/auth.service';

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
