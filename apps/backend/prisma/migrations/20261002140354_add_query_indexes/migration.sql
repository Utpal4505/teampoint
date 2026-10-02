/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Goal` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Project_Members_projectId_userId_idx";

-- DropIndex
DROP INDEX "Workspace_Members_workspaceId_userId_idx";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "isDeleted";

-- CreateIndex
CREATE INDEX "AuthProvider_userId_idx" ON "AuthProvider"("userId");

-- CreateIndex
CREATE INDEX "Project_workspaceId_createdBy_status_idx" ON "Project"("workspaceId", "createdBy", "status");

-- CreateIndex
CREATE INDEX "Project_Members_userId_status_idx" ON "Project_Members"("userId", "status");

-- CreateIndex
CREATE INDEX "Tasks_projectId_status_dueDate_idx" ON "Tasks"("projectId", "status", "dueDate");

-- CreateIndex
CREATE INDEX "Tasks_assignedTo_status_dueDate_idx" ON "Tasks"("assignedTo", "status", "dueDate");

-- CreateIndex
CREATE INDEX "Tasks_createdBy_taskType_status_idx" ON "Tasks"("createdBy", "taskType", "status");

-- CreateIndex
CREATE INDEX "Upload_uploadedBy_idx" ON "Upload"("uploadedBy");

-- CreateIndex
CREATE INDEX "Workspace_Members_userId_status_idx" ON "Workspace_Members"("userId", "status");
