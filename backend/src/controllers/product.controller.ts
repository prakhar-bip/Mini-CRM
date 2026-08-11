import { Request, Response, NextFunction } from 'express';
import {
  createProductSchema,
  updateProductSchema,
  createStockMovementSchema,
} from '../validators/product.validator';
import * as productService from '../services/product.service';
import { ProductServiceError } from '../services/product.service';

export const createProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = createProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      res.status(400).json({ message: issue ? issue.message : 'Invalid product data' });
      return;
    }

    const newProduct = await productService.createProduct(parseResult.data as any);
    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof ProductServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const search = req.query.search ? (req.query.search as string) : undefined;
    const category = req.query.category ? (req.query.category as string) : undefined;
    const lowStock = req.query.lowStock === 'true';

    const result = await productService.getProducts({
      page,
      limit,
      search,
      category,
      lowStock,
    });

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ProductServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getProductByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID format' });
      return;
    }

    const product = await productService.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof ProductServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const updateProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID format' });
      return;
    }

    const parseResult = updateProductSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      res.status(400).json({ message: issue ? issue.message : 'Invalid update data' });
      return;
    }

    const updatedProduct = await productService.updateProduct(id, parseResult.data as any);
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof ProductServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const adjustStockHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      res.status(400).json({ message: 'Invalid product ID format' });
      return;
    }

    const parseResult = createStockMovementSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      res.status(400).json({ message: issue ? issue.message : 'Invalid stock movement data' });
      return;
    }

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { quantity, type, reason } = parseResult.data;
    const result = await productService.adjustStock(
      productId,
      quantity,
      type,
      reason,
      req.user.userId
    );

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ProductServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getStockMovementsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      res.status(400).json({ message: 'Invalid product ID format' });
      return;
    }

    const movements = await productService.getStockMovements(productId);
    res.status(200).json(movements);
  } catch (error) {
    if (error instanceof ProductServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};
