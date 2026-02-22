/*
  Warnings:

  - Added the required column `joinedAt` to the `Project_Members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project_Members" ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL;
