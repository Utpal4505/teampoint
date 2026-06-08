-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_uploadId_fkey";

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "uploadId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;
