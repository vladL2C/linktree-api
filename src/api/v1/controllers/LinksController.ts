import { Response } from 'express';
import { CustomRequest } from '../types/Request';
import { prisma } from '../../../../config/database';

export const getLinks = async (req: CustomRequest, res: Response) => {
  const { userId } = req;

  const links = await prisma.link.findMany({ where: { userId } });

  console.log('LENGTH', links.length);

  res.status(200).json({
    success: true,
    data: {
      links,
    },
  });
};
