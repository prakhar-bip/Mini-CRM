import { Request, Response, NextFunction } from 'express';
import '../types/express';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization token required' });
    return;
  }

  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Invalid authorization header format' });
    return;
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    res.status(401).json({ message: 'Authorization token required' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
