import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from '../../../server/db';

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
  query: yup.object().shape({}),
  body: yup.object().shape({
    name: yup.string().required(),
  }),
});

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query, body } = postHandlerSchema.validateSync(postHandlerSchema.cast({ query: req.query, body: req.body }));

  const newPad = await prisma.pad.create({ data: body });

  return res.json({ data: newPad });
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const pads = await prisma.pad.findMany();

  return res.json({ data: pads });
}
