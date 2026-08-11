import { Request, Response, NextFunction } from 'express';
import { PrismaClient, CustomerStatus, ChallanStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStatsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      customerCount,
      leadCount,
      activeCustomerCount,
      productCount,
      products,
      challanCount,
      draftChallanCount,
      confirmedChallanCount,
      stockMovementCount,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { status: CustomerStatus.LEAD } }),
      prisma.customer.count({ where: { status: CustomerStatus.ACTIVE } }),
      prisma.product.count(),
      prisma.product.findMany({ select: { currentStock: true, minimumStock: true } }),
      prisma.challan.count(),
      prisma.challan.count({ where: { status: ChallanStatus.DRAFT } }),
      prisma.challan.count({ where: { status: ChallanStatus.CONFIRMED } }),
      prisma.stockMovement.count(),
    ]);

    const lowStockCount = products.filter((p) => p.currentStock <= p.minimumStock).length;

    res.status(200).json({
      customerCount,
      leadCount,
      activeCustomerCount,
      productCount,
      lowStockCount,
      challanCount,
      draftChallanCount,
      confirmedChallanCount,
      stockMovementCount,
    });
  } catch (error) {
    next(error);
  }
};
