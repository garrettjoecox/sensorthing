/*
  Warnings:

  - The values [REMOVED] on the enum `Channel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Channel_new" AS ENUM ('STRAIN1', 'STRAIN2', 'STRAIN3', 'STRAIN4', 'STRAIN5', 'STRAIN6', 'STRAIN7', 'STRAIN8', 'PIEZO1', 'PIEZO2', 'PIEZO3', 'PIEZO4', 'PIEZO5', 'PIEZO6', 'PIEZO7', 'PIEZO8', 'UNASSIGNED');
ALTER TABLE "job_well" ALTER COLUMN "channel" TYPE "Channel_new" USING ("channel"::text::"Channel_new");
ALTER TYPE "Channel" RENAME TO "Channel_old";
ALTER TYPE "Channel_new" RENAME TO "Channel";
DROP TYPE "Channel_old";
COMMIT;

-- AlterTable
ALTER TABLE "job_well" ALTER COLUMN "channel" SET DEFAULT E'UNASSIGNED';
