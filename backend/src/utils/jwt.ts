import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { config } from '../config/env';

export interface JwtPayload {
  userId: number;
  role: Role;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: (config.jwtExpiresIn || '1d') as any,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, config.jwtSecret);
  return decoded as JwtPayload;
};
