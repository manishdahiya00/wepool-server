/*
  Warnings:

  - Made the column `hashedOtp` on table `PasswordReset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `otpExpiresAt` on table `PasswordReset` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PasswordReset" ALTER COLUMN "hashedOtp" SET NOT NULL,
ALTER COLUMN "otpExpiresAt" SET NOT NULL;
