import { PrismaClient, ChallanStatus, StockMovementType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ChallanServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ChallanServiceError';
  }
}

export interface ChallanItemInput {
  productId: number;
  quantity: number;
}

export interface CreateChallanInput {
  customerId: number;
  challanNumber?: string;
  items: ChallanItemInput[];
}

export interface GetChallansQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ChallanStatus;
  customerId?: number;
}

export const createChallan = async (
  input: CreateChallanInput,
  createdById: number
) => {
  const customer = await prisma.customer.findUnique({
    where: { id: input.customerId },
  });

  if (!customer) {
    throw new ChallanServiceError('Customer not found', 404);
  }

  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of input.items) {
    if (!productMap.has(item.productId)) {
      throw new ChallanServiceError(`Product with ID ${item.productId} not found`, 404);
    }
  }

  let finalChallanNumber = input.challanNumber ? input.challanNumber.trim().toUpperCase() : '';

  if (!finalChallanNumber) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    finalChallanNumber = `CH-${dateStr}-${randomSuffix}`;
  }

  const existingChallan = await prisma.challan.findUnique({
    where: { challanNumber: finalChallanNumber },
  });

  if (existingChallan) {
    throw new ChallanServiceError('Challan with this challan number already exists', 400);
  }

  let totalQuantity = 0;
  const challanItemsData = input.items.map((item) => {
    const product = productMap.get(item.productId)!;
    totalQuantity += item.quantity;
    return {
      productId: item.productId,
      productNameSnapshot: product.name,
      skuSnapshot: product.sku,
      unitPriceSnapshot: product.unitPrice,
      quantity: item.quantity,
    };
  });

  return await prisma.challan.create({
    data: {
      challanNumber: finalChallanNumber,
      customerId: input.customerId,
      status: ChallanStatus.DRAFT,
      totalQuantity,
      createdById,
      items: {
        create: challanItemsData,
      },
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          businessName: true,
          email: true,
          mobile: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      items: true,
    },
  });
};

export const getChallans = async (query: GetChallansQuery) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.search && query.search.trim()) {
    const searchTerm = query.search.trim();
    where.OR = [
      { challanNumber: { contains: searchTerm, mode: 'insensitive' } },
      { customer: { name: { contains: searchTerm, mode: 'insensitive' } } },
      { customer: { businessName: { contains: searchTerm, mode: 'insensitive' } } },
    ];
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.customerId) {
    where.customerId = query.customerId;
  }

  const [data, total] = await Promise.all([
    prisma.challan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            businessName: true,
            email: true,
            mobile: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        items: true,
      },
    }),
    prisma.challan.count({ where }),
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

export const getChallanById = async (id: number) => {
  const challan = await prisma.challan.findUnique({
    where: { id },
    include: {
      customer: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!challan) {
    throw new ChallanServiceError('Challan not found', 404);
  }

  return challan;
};

export const confirmChallan = async (id: number, createdById: number) => {
  return await prisma.$transaction(async (tx) => {
    const challan = await tx.challan.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!challan) {
      throw new ChallanServiceError('Challan not found', 404);
    }

    if (challan.status !== ChallanStatus.DRAFT) {
      throw new ChallanServiceError(
        `Challan is already ${challan.status.toLowerCase()} and cannot be confirmed`,
        400
      );
    }

    // Check stock availability for all items in the challan
    for (const item of challan.items) {
      if (item.product.currentStock < item.quantity) {
        throw new ChallanServiceError(
          `Insufficient stock for product ${item.productNameSnapshot} (Available: ${item.product.currentStock}, Required: ${item.quantity})`,
          400
        );
      }
    }

    // Deduct stock and log stock movement audit entries for each item
    for (const item of challan.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          currentStock: item.product.currentStock - item.quantity,
        },
      });

      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          type: StockMovementType.OUT,
          reason: `Challan CONFIRMED: #${challan.challanNumber}`,
          createdById,
        },
      });
    }

    // Update Challan status to CONFIRMED
    return await tx.challan.update({
      where: { id },
      data: {
        status: ChallanStatus.CONFIRMED,
      },
      include: {
        customer: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        items: true,
      },
    });
  });
};

export const cancelChallan = async (id: number) => {
  const challan = await prisma.challan.findUnique({
    where: { id },
  });

  if (!challan) {
    throw new ChallanServiceError('Challan not found', 404);
  }

  if (challan.status === ChallanStatus.CONFIRMED) {
    throw new ChallanServiceError('Confirmed challans cannot be cancelled', 400);
  }

  return await prisma.challan.update({
    where: { id },
    data: {
      status: ChallanStatus.CANCELLED,
    },
    include: {
      customer: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      items: true,
    },
  });
};
