/*
  Warnings:

  - A unique constraint covering the columns `[replacedBy]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_replacedBy_key" ON "RefreshToken"("replacedBy");
