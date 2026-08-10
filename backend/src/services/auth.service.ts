import { PrismaClient, Role } from '@prisma/client';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResult {
  token: string;
  user: UserResponse;
}

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthError';
  }
}

export const loginUser = async (emailInput: string, passwordInput: string): Promise<LoginResult> => {
  const normalizedEmail = emailInput.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AuthError('Invalid email or password', 401);
  }

  const isPasswordValid = await comparePassword(passwordInput, user.passwordHash);

  if (!isPasswordValid) {
    throw new AuthError('Invalid email or password', 401);
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getUserById = async (userId: number): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new AuthError('User not found', 404);
  }

  return user;
};
