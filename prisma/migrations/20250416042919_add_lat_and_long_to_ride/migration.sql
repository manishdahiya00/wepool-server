/*
  Warnings:

  - Added the required column `fromLat` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromLong` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toLat` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toLong` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "fromLat" TEXT NOT NULL,
ADD COLUMN     "fromLong" TEXT NOT NULL,
ADD COLUMN     "toLat" TEXT NOT NULL,
ADD COLUMN     "toLong" TEXT NOT NULL;
