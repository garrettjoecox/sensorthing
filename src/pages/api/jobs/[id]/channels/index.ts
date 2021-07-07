import { Channel, JobChannel } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from '../../../../../server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return postHandler(req, res);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else if (req.method === 'GET') {
    return getHandler(req, res);
  } else {
    return res.status(501).send(undefined);
  }
}

const getHandlerSchema = yup.object().shape({
  query: yup.object().shape({
    id: yup.number().required(),
  }),
});

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = getHandlerSchema.validateSync(getHandlerSchema.cast({ query: req.query }));

  const jobChannels = await prisma.jobChannel.findMany({ where: { jobId: query.id }, include: { Sensor: true } });

  return res.json({ data: jobChannels });
}

const postHandlerSchema = yup.object().shape({
  query: yup.object().shape({
    id: yup.number().required(),
  }),
  body: yup.object().shape({
    wellId: yup.number().required(),
    sensorId: yup.number().required(),
    channel: yup.mixed<Channel>().oneOf(Object.values(Channel)).required(),
  }),
});

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query, body } = postHandlerSchema.validateSync(postHandlerSchema.cast({ query: req.query, body: req.body }));

  const existingEntry = await prisma.jobChannel.findFirst({
    where: { jobId: query.id, sensorId: body.sensorId, wellId: body.wellId },
  });
  let newJobChannel: JobChannel;

  const existingJobSensor = await prisma.jobChannel.findFirst({ where: { jobId: query.id, sensorId: body.sensorId } });
  const existingJobChannel =
    body.channel !== Channel.UNASSIGNED &&
    (await prisma.jobChannel.findFirst({ where: { jobId: query.id, channel: body.channel } }));

  if (existingEntry) {
    newJobChannel = await prisma.jobChannel.update({
      where: { id: existingEntry.id },
      data: { channel: body.channel },
    });
  } else {
    newJobChannel = await prisma.jobChannel.create({
      data: {
        jobId: query.id,
        channel: body.channel,
        sensorId: body.sensorId,
        wellId: body.wellId,
      },
    });
  }

  if (existingJobSensor && existingJobSensor.id !== newJobChannel.id) {
    await prisma.jobChannel.delete({ where: { id: existingJobSensor.id } });
  }
  if (existingJobChannel && existingJobChannel.id !== newJobChannel.id) {
    await prisma.jobChannel.update({ where: { id: existingJobChannel.id }, data: { channel: Channel.UNASSIGNED } });
  }

  return res.json({ data: newJobChannel });
}

const deleteHandlerSchema = yup.object().shape({
  query: yup.object().shape({
    id: yup.number().required(),
  }),
  body: yup.object().shape({
    wellId: yup.number().optional(),
    sensorId: yup.number().optional(),
  }),
});

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query, body } = deleteHandlerSchema.validateSync(
    deleteHandlerSchema.cast({ query: req.query, body: req.body }),
  );

  await prisma.jobChannel.deleteMany({ where: { jobId: query.id, wellId: body.wellId, sensorId: body.sensorId } });

  return res.json({ success: true });
}
