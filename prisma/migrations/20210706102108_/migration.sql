/*
  Warnings:

  - Added the required column `padId` to the `wells` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wells" ADD COLUMN     "padId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "pads" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_pad" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "padId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wells" ADD FOREIGN KEY ("padId") REFERENCES "pads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_pad" ADD FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_pad" ADD FOREIGN KEY ("padId") REFERENCES "pads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
