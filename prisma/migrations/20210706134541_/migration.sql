/*
  Warnings:

  - Added the required column `api` to the `wells` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wells" ADD COLUMN     "api" TEXT NOT NULL;
