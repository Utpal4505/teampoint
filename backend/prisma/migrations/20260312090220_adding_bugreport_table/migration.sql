-- CreateEnum
CREATE TYPE "BugReportStatus" AS ENUM ('PENDING', 'PROCESSING', 'DUPLICATE', 'AI_PROCESSED', 'GITHUB_CREATED', 'FAILED', 'RESOLVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SeverityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "BugReport" (
    "id" SERIAL NOT NULL,
    "reportedBy" INTEGER NOT NULL,
    "projectId" INTEGER,
    "page" TEXT,
    "description" TEXT,
    "consoleLog" TEXT,
    "apiRoute" TEXT,
    "attachments" JSONB,
    "metadata" JSONB,
    "fingerprint" VARCHAR(255) NOT NULL,
    "reportCount" INTEGER NOT NULL DEFAULT 1,
    "status" "BugReportStatus" NOT NULL DEFAULT 'PENDING',
    "severityLevel" "SeverityLevel",
    "severityScore" DOUBLE PRECISION,
    "aiSummary" TEXT,
    "aiTags" JSONB,
    "possibleCause" TEXT,
    "processStartTime" TIMESTAMP(3),
    "processEndTime" TIMESTAMP(3),
    "githubIssueUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "BugReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BugReport_status_idx" ON "BugReport"("status");

-- CreateIndex
CREATE INDEX "BugReport_fingerprint_idx" ON "BugReport"("fingerprint");

-- CreateIndex
CREATE INDEX "BugReport_projectId_idx" ON "BugReport"("projectId");

-- CreateIndex
CREATE INDEX "BugReport_severityLevel_idx" ON "BugReport"("severityLevel");

-- AddForeignKey
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
