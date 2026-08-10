import { PrismaClient, CustomerType, CustomerStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CustomerServiceError';
  }
}

export interface GetCustomersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: CustomerStatus;
  customerType?: CustomerType;
}

export interface CreateCustomerInput {
  name: string;
  mobile: string;
  email?: string;
  businessName: string;
  gstNumber?: string;
  customerType: CustomerType;
  address: string;
  status?: CustomerStatus;
  followUpDate?: string;
  notes?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  mobile?: string;
  email?: string;
  businessName?: string;
  gstNumber?: string;
  customerType?: CustomerType;
  address?: string;
  status?: CustomerStatus;
  followUpDate?: string;
  notes?: string;
}

export const createCustomer = async (input: CreateCustomerInput) => {
  const followUpDateObj = input.followUpDate ? new Date(input.followUpDate) : null;

  return await prisma.customer.create({
    data: {
      name: input.name.trim(),
      mobile: input.mobile.trim(),
      email: input.email ? input.email.trim().toLowerCase() : '',
      businessName: input.businessName.trim(),
      gstNumber: input.gstNumber ? input.gstNumber.trim() : null,
      customerType: input.customerType,
      address: input.address.trim(),
      status: input.status || CustomerStatus.LEAD,
      followUpDate: followUpDateObj,
      notes: input.notes ? input.notes.trim() : null,
    },
  });
};

export const getCustomers = async (query: GetCustomersQuery) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.search && query.search.trim()) {
    const searchTerm = query.search.trim();
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { mobile: { contains: searchTerm, mode: 'insensitive' } },
      { email: { contains: searchTerm, mode: 'insensitive' } },
      { businessName: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.customerType) {
    where.customerType = query.customerType;
  }

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getCustomerById = async (id: number) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      followUps: {
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!customer) {
    throw new CustomerServiceError('Customer not found', 404);
  }

  return customer;
};

export const updateCustomer = async (id: number, input: UpdateCustomerInput) => {
  const existingCustomer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!existingCustomer) {
    throw new CustomerServiceError('Customer not found', 404);
  }

  const updateData: any = {};

  if (input.name !== undefined) updateData.name = input.name.trim();
  if (input.mobile !== undefined) updateData.mobile = input.mobile.trim();
  if (input.email !== undefined) updateData.email = input.email ? input.email.trim().toLowerCase() : '';
  if (input.businessName !== undefined) updateData.businessName = input.businessName.trim();
  if (input.gstNumber !== undefined) updateData.gstNumber = input.gstNumber ? input.gstNumber.trim() : null;
  if (input.customerType !== undefined) updateData.customerType = input.customerType;
  if (input.address !== undefined) updateData.address = input.address.trim();
  if (input.status !== undefined) updateData.status = input.status;
  if (input.followUpDate !== undefined) {
    updateData.followUpDate = input.followUpDate ? new Date(input.followUpDate) : null;
  }
  if (input.notes !== undefined) updateData.notes = input.notes ? input.notes.trim() : null;

  return await prisma.customer.update({
    where: { id },
    data: updateData,
  });
};

export const addFollowUp = async (customerId: number, createdById: number, note: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new CustomerServiceError('Customer not found', 404);
  }

  return await prisma.customerFollowUp.create({
    data: {
      customerId,
      createdById,
      note: note.trim(),
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const getFollowUps = async (customerId: number) => {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new CustomerServiceError('Customer not found', 404);
  }

  return await prisma.customerFollowUp.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};
