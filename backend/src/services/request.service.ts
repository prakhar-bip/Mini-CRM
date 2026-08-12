import { PrismaClient, Role, RequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateRequestInput {
  title: string;
  description: string;
  category: string;
  targetRole: Role;
  requestedById: number;
}

export const createRequest = async (input: CreateRequestInput) => {
  return prisma.approvalRequest.create({
    data: {
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      targetRole: input.targetRole,
      requestedById: input.requestedById,
    },
    include: {
      requestedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      reviewedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
};

export const getRequestsForUser = async (userId: number, userRole: Role) => {
  const isMasterAdmin = userRole === Role.ADMIN;

  // Requests assigned to user's role (or all for admin)
  const assigned = await prisma.approvalRequest.findMany({
    where: isMasterAdmin
      ? {}
      : {
          targetRole: userRole,
        },
    include: {
      requestedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      reviewedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Requests sent by the user themselves
  const sent = await prisma.approvalRequest.findMany({
    where: {
      requestedById: userId,
    },
    include: {
      requestedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      reviewedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { assigned, sent };
};

export const updateRequestStatus = async (
  requestId: number,
  status: RequestStatus,
  reviewerId: number,
  reviewerRole: Role,
  reviewNote?: string
) => {
  const reqItem = await prisma.approvalRequest.findUnique({
    where: { id: requestId },
  });

  if (!reqItem) {
    throw new Error('Approval request not found');
  }

  // Authorization check: User must be Admin or match targetRole
  if (reviewerRole !== Role.ADMIN && reqItem.targetRole !== reviewerRole) {
    throw new Error(`Only ${reqItem.targetRole} department or ADMIN can review this request`);
  }

  return prisma.approvalRequest.update({
    where: { id: requestId },
    data: {
      status,
      reviewedById: reviewerId,
      reviewNote: reviewNote ? reviewNote.trim() : undefined,
    },
    include: {
      requestedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      reviewedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
};
