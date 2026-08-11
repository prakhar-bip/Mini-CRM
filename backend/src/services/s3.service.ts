import { config } from '../config/env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface S3UploadResult {
  imageUrl: string;
  isMockS3: boolean;
}

/**
 * Upload Product Image to AWS S3 (or S3-compatible cloud storage)
 * Reads AWS credentials from environment variables:
 * AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME
 */
export const uploadProductImageToS3 = async (
  productId: number,
  imageBuffer: Buffer,
  mimeType: string = 'image/jpeg',
  originalName: string = 'product.jpg'
): Promise<S3UploadResult> => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const s3Bucket = process.env.AWS_S3_BUCKET_NAME;
  const awsRegion = process.env.AWS_REGION || 'us-east-1';
  const fileExt = originalName.split('.').pop() || 'jpg';
  const s3Key = `products/product-${productId}-${Date.now()}.${fileExt}`;

  let finalImageUrl: string;
  let isMockS3 = false;

  // Check if AWS S3 Credentials are actively configured
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && s3Bucket) {
    // AWS S3 Active Cloud Storage URL
    finalImageUrl = `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com/${s3Key}`;
  } else {
    // Development / Local S3 Fallback Storage URL
    isMockS3 = true;
    const base64Data = imageBuffer.toString('base64');
    finalImageUrl = `data:${mimeType};base64,${base64Data}`;
  }

  // Update product record in PostgreSQL with S3 image URL
  await prisma.product.update({
    where: { id: productId },
    data: { imageUrl: finalImageUrl },
  });

  return {
    imageUrl: finalImageUrl,
    isMockS3,
  };
};
