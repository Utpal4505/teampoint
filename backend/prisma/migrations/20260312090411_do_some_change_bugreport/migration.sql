/*
  Warnings:

  - You are about to drop the column `archivedAt` on the `BugReport` table. All the data in the column will be lost.
  - You are about to drop the column `possibleCause` on the `BugReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BugReport" DROP COLUMN "archivedAt",
DROP COLUMN "possibleCause";
