import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();

export interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const createUser = async (input: CreateUserInput) => {
  const normalizedEmail = input.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new Error('User with this email already exists');
  }

  const defaultPassword = input.password || 'Password@123';
  const passwordHash = await hashPassword(defaultPassword);

  return prisma.user.create({
    data: {
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: input.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const deleteUserById = async (userId: number, currentAdminId: number) => {
  if (userId === currentAdminId) {
    throw new Error('You cannot delete your own admin account');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return prisma.$transaction(async (tx) => {
    await tx.customerFollowUp.deleteMany({
      where: { createdById: userId },
    });

    await tx.stockMovement.deleteMany({
      where: { createdById: userId },
    });

    const userChallans = await tx.challan.findMany({
      where: { createdById: userId },
      select: { id: true },
    });
    const challanIds = userChallans.map((c) => c.id);

    if (challanIds.length > 0) {
      await tx.challanItem.deleteMany({
        where: { challanId: { in: challanIds } },
      });
      await tx.challan.deleteMany({
        where: { id: { in: challanIds } },
      });
    }

    return tx.user.delete({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
  });
};
