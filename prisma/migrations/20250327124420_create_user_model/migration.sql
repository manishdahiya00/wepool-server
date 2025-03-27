/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDevice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `deviceId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserDevice" DROP CONSTRAINT "UserDevice_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deviceId" TEXT NOT NULL,
ADD COLUMN     "deviceName" TEXT NOT NULL,
ADD COLUMN     "deviceType" TEXT NOT NULL;

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "UserDevice";
