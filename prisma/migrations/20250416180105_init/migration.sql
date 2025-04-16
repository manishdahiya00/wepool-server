/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `date` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "publishedAt",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
