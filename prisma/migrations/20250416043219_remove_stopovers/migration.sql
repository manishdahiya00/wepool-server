/*
  Warnings:

  - You are about to drop the `StopOver` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StopOver" DROP CONSTRAINT "StopOver_rideId_fkey";

-- DropForeignKey
ALTER TABLE "StopOver" DROP CONSTRAINT "StopOver_userId_fkey";

-- DropTable
DROP TABLE "StopOver";
