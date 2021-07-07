import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from '../../../../../server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else {
    return res.status(501).send(undefined);
  }
}

const deleteHandlerSchema = yup.object().shape({
  query: yup.object().shape({
    id: yup.number().required(),
    pad: yup.number().required(),
  }),
  body: yup.object().shape({}),
});

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query, body } = deleteHandlerSchema.validateSync(deleteHandlerSchema.cast({ query: req.query }));

  await prisma.jobPad.deleteMany({ where: { jobId: query.id, padId: query.pad } });

  return res.json({ success: true });
}
