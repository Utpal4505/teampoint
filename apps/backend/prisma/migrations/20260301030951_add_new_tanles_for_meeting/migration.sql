/*
  Warnings:

  - You are about to drop the column `actionItems` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `keyDecisions` on the `Meeting` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[meetingId,userId]` on the table `MeetingParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ActionItemStatus" AS ENUM ('PENDING', 'CONVERTED');

-- DropIndex
DROP INDEX "Meeting_projectId_createdBy_status_idx";

-- DropIndex
DROP INDEX "MeetingParticipant_meetingId_userId_idx";

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "actionItems",
DROP COLUMN "keyDecisions",
ADD COLUMN     "cancelledAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "MeetingActionItem" (
    "id" SERIAL NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "assignedToId" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "ActionItemStatus" NOT NULL DEFAULT 'PENDING',
    "convertedTaskId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeetingActionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MeetingActionItem_convertedTaskId_key" ON "MeetingActionItem"("convertedTaskId");

-- CreateIndex
CREATE INDEX "MeetingActionItem_meetingId_idx" ON "MeetingActionItem"("meetingId");

-- CreateIndex
CREATE INDEX "MeetingActionItem_assignedToId_idx" ON "MeetingActionItem"("assignedToId");

-- CreateIndex
CREATE INDEX "Meeting_projectId_idx" ON "Meeting"("projectId");

-- CreateIndex
CREATE INDEX "Meeting_status_idx" ON "Meeting"("status");

-- CreateIndex
CREATE INDEX "Meeting_createdBy_idx" ON "Meeting"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingParticipant_meetingId_userId_key" ON "MeetingParticipant"("meetingId", "userId");

-- CreateIndex
CREATE INDEX "Tasks_dueDate_idx" ON "Tasks"("dueDate");

-- AddForeignKey
ALTER TABLE "MeetingActionItem" ADD CONSTRAINT "MeetingActionItem_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingActionItem" ADD CONSTRAINT "MeetingActionItem_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingActionItem" ADD CONSTRAINT "MeetingActionItem_convertedTaskId_fkey" FOREIGN KEY ("convertedTaskId") REFERENCES "Tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
