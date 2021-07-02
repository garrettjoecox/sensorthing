import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from '../../../../server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    return patchHandler(req, res);
  } else if (req.method === 'GET') {
    return getHandler(req, res);
  } else {
    return res.status(501).send(undefined);
  }
}

const patchHandlerSchema = yup.object().shape({
  query: yup.object().shape({
    id: yup.number().required(),
  }),
  body: yup.object().shape({
    startedAt: yup.date().optional(),
    endedAt: yup.date().optional(),
    name: yup.string().optional(),
    customer: yup.string().optional(),
  }),
});

async function patchHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query, body } = patchHandlerSchema.validateSync(
    patchHandlerSchema.cast({ query: req.query, body: req.body }),
  );

  const updatedJob = await prisma.job.update({ where: { id: query.id }, data: body });

  return res.json({ data: updatedJob });
}

const getHandlerSchema = yup.object().shape({
  query: yup.object().shape({
    id: yup.number().required(),
  }),
});

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query, body } = getHandlerSchema.validateSync(getHandlerSchema.cast({ query: req.query }));

  const job = await prisma.job.findUnique({ where: { id: query.id } });

  return res.json({ data: job });
}
