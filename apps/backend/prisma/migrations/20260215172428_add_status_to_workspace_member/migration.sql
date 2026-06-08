-- CreateEnum
CREATE TYPE "WorkspaceMemberStatus" AS ENUM ('ACTIVE', 'INVITED', 'REMOVED', 'LEFT', 'BLOCKED');

-- AlterTable
ALTER TABLE "Workspace_Members" ADD COLUMN     "status" "WorkspaceMemberStatus" NOT NULL DEFAULT 'ACTIVE';
