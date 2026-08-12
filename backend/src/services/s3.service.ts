import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface S3UploadResult {
  imageUrl: string;
  isMockS3: boolean;
}

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
  const fileName = `product-${productId}-${Date.now()}.${fileExt}`;
  const s3Key = `products/${fileName}`;

  let finalImageUrl: string;
  let isMockS3 = false;

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && s3Bucket) {
    finalImageUrl = `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com/${s3Key}`;
  } else {
    isMockS3 = true;
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, imageBuffer);
    finalImageUrl = `http://localhost:5000/uploads/${fileName}`;
  }

  await prisma.product.update({
    where: { id: productId },
    data: { imageUrl: finalImageUrl },
  });

  return {
    imageUrl: finalImageUrl,
    isMockS3,
  };
};

