/*
  Warnings:

  - The values [ACTIVE,RESOLVED,ARCHIVED] on the enum `DiscussionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `priority` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `reopenRequestStatus` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `reopenRequested` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `reopenRequestedAt` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `reopenRequestedBy` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `reopenReviewedAt` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `reopenReviewedBy` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `repoenRequestReason` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedAt` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscussionType" AS ENUM ('GENERAL', 'TASK');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('NORMAL', 'DECISION');

-- AlterEnum
BEGIN;
CREATE TYPE "DiscussionStatus_new" AS ENUM ('OPEN', 'CLOSED');
ALTER TABLE "public"."Discussion" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Discussion" ALTER COLUMN "status" TYPE "DiscussionStatus_new" USING ("status"::text::"DiscussionStatus_new");
ALTER TYPE "DiscussionStatus" RENAME TO "DiscussionStatus_old";
ALTER TYPE "DiscussionStatus_new" RENAME TO "DiscussionStatus";
DROP TYPE "public"."DiscussionStatus_old";
ALTER TABLE "Discussion" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_commentBy_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_discussionId_fkey";

-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_reopenRequestedBy_fkey";

-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_reopenReviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_userId_fkey";

-- AlterTable
ALTER TABLE "Discussion" DROP COLUMN "priority",
DROP COLUMN "reopenRequestStatus",
DROP COLUMN "reopenRequested",
DROP COLUMN "reopenRequestedAt",
DROP COLUMN "reopenRequestedBy",
DROP COLUMN "reopenReviewedAt",
DROP COLUMN "reopenReviewedBy",
DROP COLUMN "repoenRequestReason",
DROP COLUMN "resolvedAt",
DROP COLUMN "userId",
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "contextId" INTEGER,
ADD COLUMN     "type" "DiscussionType" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- DropTable
DROP TABLE "Comment";

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'NORMAL',
    "parentMessageId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_discussionId_idx" ON "Message"("discussionId");

-- CreateIndex
CREATE INDEX "Message_parentMessageId_idx" ON "Message"("parentMessageId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
