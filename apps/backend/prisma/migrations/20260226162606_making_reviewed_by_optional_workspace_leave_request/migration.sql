-- DropForeignKey
ALTER TABLE "WorkspaceLeaveRequest" DROP CONSTRAINT "WorkspaceLeaveRequest_reviewedBy_fkey";

-- AlterTable
ALTER TABLE "WorkspaceLeaveRequest" ALTER COLUMN "reviewedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkspaceLeaveRequest" ADD CONSTRAINT "WorkspaceLeaveRequest_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
