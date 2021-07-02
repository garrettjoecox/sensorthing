-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('STRAIN1', 'STRAIN2', 'STRAIN3', 'STRAIN4', 'STRAIN5', 'STRAIN6', 'STRAIN7', 'STRAIN8', 'PIEZO1', 'PIEZO2', 'PIEZO3', 'PIEZO4', 'PIEZO5', 'PIEZO6', 'PIEZO7', 'PIEZO8');

-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('STRAIN', 'PIEZO');

-- CreateTable
CREATE TABLE "wells" (
    "id" SERIAL NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensors" (
    "id" SERIAL NOT NULL,
    "type" "SensorType" NOT NULL,
    "balance" INTEGER NOT NULL,
    "sensitivity" INTEGER NOT NULL,
    "sampleRate" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "customer" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_well" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "wellId" INTEGER NOT NULL,
    "sensorId" INTEGER NOT NULL,
    "channel" "Channel" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_measurement" (
    "jobId" INTEGER NOT NULL,
    "wellId" INTEGER NOT NULL,
    "sensorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "SensorType" NOT NULL,
    "value" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "job_measurement.createdAt_jobId_wellId_sensorId_unique" ON "job_measurement"("createdAt", "jobId", "wellId", "sensorId");

-- AddForeignKey
ALTER TABLE "job_well" ADD FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_well" ADD FOREIGN KEY ("wellId") REFERENCES "wells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_well" ADD FOREIGN KEY ("sensorId") REFERENCES "sensors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_measurement" ADD FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_measurement" ADD FOREIGN KEY ("wellId") REFERENCES "wells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_measurement" ADD FOREIGN KEY ("sensorId") REFERENCES "sensors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
