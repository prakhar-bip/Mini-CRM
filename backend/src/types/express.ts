import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  userId: number;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
