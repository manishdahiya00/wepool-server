/*
  Warnings:

  - The `otpExpiresAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "otpExpiresAt",
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ALTER COLUMN "hashedOtp" DROP NOT NULL,
ALTER COLUMN "hashedOtp" SET DATA TYPE TEXT;
