/*
  Warnings:

  - Added the required column `accessToken` to the `AuthProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `AuthProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `AuthProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthProvider" ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
