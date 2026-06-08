-- DropForeignKey
ALTER TABLE "BugReport" DROP CONSTRAINT "BugReport_reportedBy_fkey";

-- AlterTable
ALTER TABLE "BugReport" ALTER COLUMN "reportedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
