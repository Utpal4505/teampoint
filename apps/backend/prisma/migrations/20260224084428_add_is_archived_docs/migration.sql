/*
  Warnings:

  - You are about to drop the column `status` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "status",
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "DocumentStatus";
