import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
const prisma = new PrismaClient();

async function main() {
  const pad1 = await prisma.pad.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'BRISCOE CATARINA NORTH Pad',
      Wells: {
        createMany: {
          data: [
            { name: 'BRISCOE CATARINA NORTH 12H', api: 'abc' },
            { name: 'BRISCOE CATARINA NORTH 12I', api: 'abc' },
            { name: 'BRISCOE CATARINA NORTH 12J', api: 'abc' },
          ],
        },
      },
    },
  });
  const pad2 = await prisma.pad.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'BRISCOE CATARINA SOUTH Pad',
      Wells: {
        createMany: {
          data: [
            { name: 'BRISCOE CATARINA SOUTH 9H', api: 'abc' },
            { name: 'BRISCOE CATARINA SOUTH 9I', api: 'abc' },
            { name: 'BRISCOE CATARINA SOUTH 9J', api: 'abc' },
          ],
        },
      },
    },
  });
  const pad3 = await prisma.pad.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'BRISCOE CATARINA WEST Pad',
      Wells: {
        createMany: {
          data: [
            { name: 'BRISCOE CATARINA WEST 16H', api: 'abc' },
            { name: 'BRISCOE CATARINA WEST 16I', api: 'abc' },
            { name: 'BRISCOE CATARINA WEST 16J', api: 'abc' },
          ],
        },
      },
    },
  });

  const sensor1 = await prisma.sensor.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: nanoid(6),
      type: 'PIEZO',
      sensitivity: 1.044,
      balance: 0.8492,
      sampleRate: 1000,
    },
  });
  const sensor2 = await prisma.sensor.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: nanoid(6),
      type: 'STRAIN',
      sensitivity: 1.044,
      balance: 0.8492,
      sampleRate: 4000,
    },
  });
  const sensor3 = await prisma.sensor.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: nanoid(6),
      type: 'PIEZO',
      sensitivity: 1.044,
      balance: 0.8492,
      sampleRate: 1000,
    },
  });
  const sensor4 = await prisma.sensor.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: nanoid(6),
      type: 'STRAIN',
      sensitivity: 1.044,
      balance: 0.8492,
      sampleRate: 1000,
    },
  });
  const sensor5 = await prisma.sensor.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: nanoid(6),
      type: 'PIEZO',
      sensitivity: 1.044,
      balance: 0.8492,
      sampleRate: 1000,
    },
  });
  const sensor6 = await prisma.sensor.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: nanoid(6),
      type: 'STRAIN',
      sensitivity: 1.044,
      balance: 0.8492,
      sampleRate: 1000,
    },
  });

  const job1 = await prisma.job.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test Frac 1',
      customer: 'Ozark',
      JobPads: {
        createMany: {
          data: [
            {
              padId: pad1.id,
            },
            {
              padId: pad2.id,
            },
            {
              padId: pad3.id,
            },
          ],
        },
      },
      JobChannels: {
        createMany: {
          data: [
            {
              wellId: 1,
              sensorId: sensor1.id,
              channel: 'PIEZO1',
            },
            {
              wellId: 1,
              sensorId: sensor2.id,
              channel: 'STRAIN1',
            },
          ],
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
