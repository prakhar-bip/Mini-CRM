-- AlterTable
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "ApprovalRequest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetRole" "Role" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedById" INTEGER NOT NULL,
    "reviewedById" INTEGER,
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ApprovalRequest_targetRole_idx" ON "ApprovalRequest"("targetRole");
CREATE INDEX IF NOT EXISTS "ApprovalRequest_status_idx" ON "ApprovalRequest"("status");
CREATE INDEX IF NOT EXISTS "ApprovalRequest_requestedById_idx" ON "ApprovalRequest"("requestedById");

-- AddForeignKey
ALTER TABLE "ApprovalRequest" DROP CONSTRAINT IF EXISTS "ApprovalRequest_requestedById_fkey";
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ApprovalRequest" DROP CONSTRAINT IF EXISTS "ApprovalRequest_reviewedById_fkey";
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
