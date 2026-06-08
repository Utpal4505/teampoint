/*
  Warnings:

  - You are about to drop the column `scope` on the `IntegrationToken` table. All the data in the column will be lost.
  - Made the column `providerUserId` on table `Integration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expiresAt` on table `IntegrationToken` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Integration" ADD COLUMN     "connectedAt" TIMESTAMP(3),
ALTER COLUMN "providerUserId" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DISCONNECTED';

-- AlterTable
ALTER TABLE "IntegrationToken" DROP COLUMN "scope",
ALTER COLUMN "expiresAt" SET NOT NULL;
