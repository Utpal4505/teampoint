-- DropIndex
DROP INDEX "Tasks_projectId_assignedTo_taskType_status_idx";

-- CreateIndex
CREATE INDEX "Tasks_projectId_idx" ON "Tasks"("projectId");

-- CreateIndex
CREATE INDEX "Tasks_assignedTo_idx" ON "Tasks"("assignedTo");

-- CreateIndex
CREATE INDEX "Tasks_createdBy_idx" ON "Tasks"("createdBy");

-- CreateIndex
CREATE INDEX "Tasks_taskType_idx" ON "Tasks"("taskType");

-- CreateIndex
CREATE INDEX "Tasks_status_idx" ON "Tasks"("status");


ALTER TABLE "Tasks"
ADD CONSTRAINT task_type_projectid_check
CHECK (
  ("taskType" = 'PROJECT' AND "projectId" IS NOT NULL)
  OR
  ("taskType" = 'PERSONAL' AND "projectId" IS NULL)
);

