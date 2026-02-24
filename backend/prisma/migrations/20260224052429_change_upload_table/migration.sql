/*
  Warnings:

  - You are about to drop the column `signedUrl` on the `Upload` table. All the data in the column will be lost.
  - Added the required column `uploadedBy` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Upload_createdAt_idx";

-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "signedUrl",
ADD COLUMN     "uploadedBy" INTEGER NOT NULL;
