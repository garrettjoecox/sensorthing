/*
  Warnings:

  - Added the required column `name` to the `sensors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `wells` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sensors" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "wells" ADD COLUMN     "name" TEXT NOT NULL;
