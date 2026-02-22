-- CreateEnum
CREATE TYPE "DocumentLinkStatus" AS ENUM ('LINKED', 'UNLINKED');

-- AlterEnum
ALTER TYPE "DocumentEntityType" ADD VALUE 'MEETING';

-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "reopenRequestStatus" "LeaveRequestStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "reopenRequested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reopenRequestedAt" TIMESTAMP(3),
ADD COLUMN     "reopenRequestedBy" INTEGER,
ADD COLUMN     "reopenReviewedAt" TIMESTAMP(3),
ADD COLUMN     "reopenReviewedBy" INTEGER,
ADD COLUMN     "repoenRequestReason" TEXT,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "DocumentLink" ADD COLUMN     "status" "DocumentLinkStatus" NOT NULL DEFAULT 'LINKED',
ADD COLUMN     "unlinkedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "Invite_Member" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "Milestone" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Project_Members" ADD COLUMN     "status" "WorkspaceMemberStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Tasks" ALTER COLUMN "status" SET DEFAULT 'TODO';

-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "WorkspaceLeaveRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_reopenRequestedBy_fkey" FOREIGN KEY ("reopenRequestedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_reopenReviewedBy_fkey" FOREIGN KEY ("reopenReviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
