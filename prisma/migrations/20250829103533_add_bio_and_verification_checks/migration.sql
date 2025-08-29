-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "isGovtProofConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPhnConfirmed" BOOLEAN NOT NULL DEFAULT false;
