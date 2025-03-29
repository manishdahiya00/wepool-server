/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `PasswordReset` table. All the data in the column will be lost.
  - Added the required column `otpExpiresAt` to the `PasswordReset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resetTokenExpiresAt` to the `PasswordReset` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PasswordReset_expiresAt_idx";

-- AlterTable
ALTER TABLE "PasswordReset" DROP COLUMN "expiresAt",
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "PasswordReset_otpExpiresAt_idx" ON "PasswordReset"("otpExpiresAt");
