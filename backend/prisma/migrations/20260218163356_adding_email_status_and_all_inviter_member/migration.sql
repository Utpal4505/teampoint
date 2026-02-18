-- CreateEnum
CREATE TYPE "InviteEmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "Invite_Member" ADD COLUMN     "emailAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "emailStatus" "InviteEmailStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "lastEmailError" TEXT;
