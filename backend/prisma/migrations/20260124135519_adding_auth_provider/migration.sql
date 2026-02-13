/*
  Warnings:

  - You are about to drop the column `oauth_provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `oauth_provider_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tasks" ALTER COLUMN "projectId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "oauth_provider",
DROP COLUMN "oauth_provider_id";

-- CreateTable
CREATE TABLE "AuthProvider" (
    "id" SERIAL NOT NULL,
    "provider" "OAuthProvider" NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_provider_providerUserId_key" ON "AuthProvider"("provider", "providerUserId");

-- AddForeignKey
ALTER TABLE "AuthProvider" ADD CONSTRAINT "AuthProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
