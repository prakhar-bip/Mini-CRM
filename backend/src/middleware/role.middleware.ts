import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const userRoleStr = String(req.user.role).toUpperCase();
    const allowedRolesStr = allowedRoles.map((r) => String(r).toUpperCase());

    // ADMIN role has master access across all routes
    if (userRoleStr === 'ADMIN' || allowedRolesStr.includes(userRoleStr)) {
      next();
      return;
    }

    res.status(403).json({
      message: `Access denied: Role ${userRoleStr} is not authorized for this action.`,
    });
  };
};
