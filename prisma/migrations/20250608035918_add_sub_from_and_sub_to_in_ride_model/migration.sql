/*
  Warnings:

  - Added the required column `subFrom` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTo` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "subFrom" TEXT NOT NULL,
ADD COLUMN     "subTo" TEXT NOT NULL;
