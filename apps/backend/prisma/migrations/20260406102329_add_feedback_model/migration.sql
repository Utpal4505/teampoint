-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('GENERAL', 'UI_UX', 'PERFORMANCE', 'FEATURE_REQUEST');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('NEW', 'REVIEWED', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "submittedBy" INTEGER,
    "projectId" INTEGER,
    "type" "FeedbackType" NOT NULL,
    "rating" SMALLINT,
    "message" TEXT,
    "problem" TEXT,
    "solution" TEXT,
    "page" TEXT,
    "confusion" TEXT,
    "slowArea" TEXT,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'NEW',
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" INTEGER,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feedback_type_status_idx" ON "Feedback"("type", "status");

-- CreateIndex
CREATE INDEX "Feedback_projectId_idx" ON "Feedback"("projectId");

-- CreateIndex
CREATE INDEX "Feedback_submittedBy_idx" ON "Feedback"("submittedBy");

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
