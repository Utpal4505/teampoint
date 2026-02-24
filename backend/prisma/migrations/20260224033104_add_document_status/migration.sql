/*
  Warnings:

  - You are about to drop the column `isArchived` on the `Document` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "isArchived",
ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT';
