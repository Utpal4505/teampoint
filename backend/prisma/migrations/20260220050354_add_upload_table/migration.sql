/*
  Warnings:

  - You are about to drop the column `fileType` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uploadId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatarUploadId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uploadId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UploadCategory" AS ENUM ('AVATAR', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "ContextType" AS ENUM ('USER', 'PROJECT');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('R2');

-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'UPLOADED', 'FAILED', 'ABORTED');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "fileType",
DROP COLUMN "fileUrl",
ADD COLUMN     "uploadId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar_url",
ADD COLUMN     "avatarUploadId" INTEGER,
ADD COLUMN     "avatarUrl" VARCHAR(500);

-- CreateTable
CREATE TABLE "Upload" (
    "id" SERIAL NOT NULL,
    "fileKey" TEXT NOT NULL,
    "category" "UploadCategory" NOT NULL,
    "contextId" INTEGER NOT NULL,
    "contextType" "ContextType",
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "storage" "StorageProvider" NOT NULL DEFAULT 'R2',
    "status" "UploadStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "checksum" TEXT,
    "signedUrl" TEXT,
    "retries" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upload_fileKey_key" ON "Upload"("fileKey");

-- CreateIndex
CREATE UNIQUE INDEX "Upload_contextId_key" ON "Upload"("contextId");

-- CreateIndex
CREATE INDEX "Upload_category_contextId_idx" ON "Upload"("category", "contextId");

-- CreateIndex
CREATE INDEX "Upload_createdAt_idx" ON "Upload"("createdAt");

-- CreateIndex
CREATE INDEX "Upload_expiresAt_idx" ON "Upload"("expiresAt");

-- CreateIndex
CREATE INDEX "Upload_status_idx" ON "Upload"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Document_uploadId_key" ON "Document"("uploadId");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarUploadId_key" ON "User"("avatarUploadId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarUploadId_fkey" FOREIGN KEY ("avatarUploadId") REFERENCES "Upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Upload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
