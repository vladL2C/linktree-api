import { Response } from 'express';
import { CustomRequest } from '../types/Request';

export const getLinks = (req: CustomRequest, res: Response) => {
  res.status(200).json({
    success: true,
    links: 'hello world',
  });
};
