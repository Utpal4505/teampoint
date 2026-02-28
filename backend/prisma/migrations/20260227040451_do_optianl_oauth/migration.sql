-- AlterTable
ALTER TABLE "AuthProvider" ALTER COLUMN "accessToken" DROP NOT NULL,
ALTER COLUMN "refreshToken" DROP NOT NULL;
