/*
  Warnings:

  - Added the required column `title` to the `BugReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BugReport" ADD COLUMN     "title" VARCHAR(255) NOT NULL;
