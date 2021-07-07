import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from '../../../../../server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return postHandler(req, res);
  } else if (req.method === 'GET') {
    return getHandler(req, res);
  } else {
    return res.status(501).send(undefined);
  }
}

const postHandlerSchema = yup.object().shape({
  query: yup.object().shape({
    id: yup.number().required(),
  }),
  body: yup.object().shape({
    padId: yup.number().required(),
  }),
});

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query, body } = postHandlerSchema.validateSync(postHandlerSchema.cast({ query: req.query, body: req.body }));

  console.log(query, body);
  const newJobPad = await prisma.jobPad.create({ data: { jobId: query.id, padId: body.padId } });

  return res.json({ data: newJobPad });
}

const getHandlerSchema = yup.object().shape({
  query: yup.object().shape({
    id: yup.number().required(),
  }),
});

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = getHandlerSchema.validateSync(getHandlerSchema.cast({ query: req.query }));

  const jobPads = await prisma.jobPad.findMany({ where: { jobId: query.id } });

  return res.json({ data: jobPads });
}
