import { Channel, JobChannel } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from '../../../../../server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    return patchHandler(req, res);
  } else {
    return res.status(501).send(undefined);
  }
}

const patchHandlerSchema = yup.object().shape({
  query: yup.object().shape({
    id: yup.number().required(),
    channel: yup.mixed<Channel>().oneOf(Object.values(Channel)).required(),
  }),
  body: yup.object().shape({
    wellId: yup.number().optional(),
    sensorId: yup.number().optional(),
  }),
});

async function patchHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query, body } = patchHandlerSchema.validateSync(
    patchHandlerSchema.cast({ query: req.query, body: req.body }),
  );

  const existingJobChannel = await prisma.jobChannel.findFirst({ where: { jobId: query.id, channel: query.channel } });
  let newJobChannel: JobChannel;

  const existingJobSensor =
    body.sensorId && (await prisma.jobChannel.findFirst({ where: { jobId: query.id, sensorId: body.sensorId } }));

  if (existingJobChannel) {
    newJobChannel = await prisma.jobChannel.update({
      where: { id: existingJobChannel.id },
      data: { sensorId: body.sensorId, wellId: body.wellId },
    });
  } else {
    newJobChannel = await prisma.jobChannel.create({
      data: {
        jobId: query.id,
        channel: query.channel,
        sensorId: body.sensorId,
        wellId: body.wellId,
      },
    });
  }

  if (existingJobSensor && existingJobSensor.id !== newJobChannel.id) {
    await prisma.jobChannel.update({ where: { id: existingJobSensor.id }, data: { sensorId: null } });
  }

  return res.json({ data: newJobChannel });
}
