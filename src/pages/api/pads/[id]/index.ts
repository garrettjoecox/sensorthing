import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from '../../../../server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
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

  const pad = await prisma.pad.findUnique({ where: { id: query.id } });

  return res.json({ data: pad });
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = getHandlerSchema.validateSync(getHandlerSchema.cast({ query: req.query }));

  await prisma.pad.delete({ where: { id: query.id } });

  return res.json({ success: true });
}
