/*
  Warnings:

  - Added the required column `updatedAt` to the `Workspace_Members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workspace_Members" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
