import { PrismaClient, StockMovementType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ProductServiceError';
  }
}

export interface GetProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  lowStock?: boolean;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock?: number;
  minimumStock?: number;
  warehouseLocation: string;
}

export interface UpdateProductInput {
  name?: string;
  sku?: string;
  category?: string;
  unitPrice?: number;
  currentStock?: number;
  minimumStock?: number;
  warehouseLocation?: string;
}

export const createProduct = async (input: CreateProductInput) => {
  const normalizedSku = input.sku.trim().toUpperCase();

  const existingProduct = await prisma.product.findUnique({
    where: { sku: normalizedSku },
  });

  if (existingProduct) {
    throw new ProductServiceError('Product with this SKU already exists', 400);
  }

  return await prisma.product.create({
    data: {
      name: input.name.trim(),
      sku: normalizedSku,
      category: input.category.trim(),
      unitPrice: new Prisma.Decimal(input.unitPrice),
      currentStock: input.currentStock !== undefined ? input.currentStock : 0,
      minimumStock: input.minimumStock !== undefined ? input.minimumStock : 0,
      warehouseLocation: input.warehouseLocation.trim(),
    },
  });
};

export const getProducts = async (query: GetProductsQuery) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.search && query.search.trim()) {
    const searchTerm = query.search.trim();
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { sku: { contains: searchTerm, mode: 'insensitive' } },
      { category: { contains: searchTerm, mode: 'insensitive' } },
      { warehouseLocation: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  if (query.category && query.category.trim()) {
    where.category = { equals: query.category.trim(), mode: 'insensitive' };
  }

  const allMatching = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  const finalFiltered = query.lowStock
    ? allMatching.filter((p) => p.currentStock <= p.minimumStock)
    : allMatching;

  const total = finalFiltered.length;
  const paginatedData = finalFiltered.slice(skip, skip + limit);
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      movements: {
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

  if (!product) {
    throw new ProductServiceError('Product not found', 404);
  }

  return product;
};

export const updateProduct = async (id: number, input: UpdateProductInput) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new ProductServiceError('Product not found', 404);
  }

  const updateData: any = {};

  if (input.sku !== undefined) {
    const normalizedSku = input.sku.trim().toUpperCase();
    if (normalizedSku !== existingProduct.sku) {
      const skuConflict = await prisma.product.findUnique({
        where: { sku: normalizedSku },
      });
      if (skuConflict) {
        throw new ProductServiceError('Product with this SKU already exists', 400);
      }
      updateData.sku = normalizedSku;
    }
  }

  if (input.name !== undefined) updateData.name = input.name.trim();
  if (input.category !== undefined) updateData.category = input.category.trim();
  if (input.unitPrice !== undefined) updateData.unitPrice = new Prisma.Decimal(input.unitPrice);
  if (input.currentStock !== undefined) updateData.currentStock = input.currentStock;
  if (input.minimumStock !== undefined) updateData.minimumStock = input.minimumStock;
  if (input.warehouseLocation !== undefined) updateData.warehouseLocation = input.warehouseLocation.trim();

  return await prisma.product.update({
    where: { id },
    data: updateData,
  });
};

export const adjustStock = async (
  productId: number,
  quantity: number,
  type: StockMovementType,
  reason: string,
  createdById: number
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new ProductServiceError('Product not found', 404);
  }

  if (type === StockMovementType.OUT && product.currentStock < quantity) {
    throw new ProductServiceError(
      `Insufficient stock for product ${product.name} (Available: ${product.currentStock}, Requested: ${quantity})`,
      400
    );
  }

  const stockDelta = type === StockMovementType.IN ? quantity : -quantity;
  const newStock = product.currentStock + stockDelta;

  return await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: { currentStock: newStock },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId,
        quantity,
        type,
        reason: reason.trim(),
        createdById,
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

    return {
      product: updatedProduct,
      movement,
    };
  });
};

export const getStockMovements = async (productId: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new ProductServiceError('Product not found', 404);
  }

  return await prisma.stockMovement.findMany({
    where: { productId },
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
