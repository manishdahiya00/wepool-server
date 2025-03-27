/*
  Warnings:

  - Added the required column `deviceName` to the `UserDevice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDevice" ADD COLUMN     "deviceName" TEXT NOT NULL;
