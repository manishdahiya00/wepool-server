-- DropIndex
DROP INDEX "PasswordReset_hashedOtp_key";

-- AlterTable
ALTER TABLE "PasswordReset" ALTER COLUMN "hashedOtp" DROP NOT NULL,
ALTER COLUMN "otpExpiresAt" DROP NOT NULL;
