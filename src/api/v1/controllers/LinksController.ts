import { Response } from 'express';
import { validationResult } from 'express-validator/check';
import HttpStatusCodes from 'http-status-codes';
import { CustomRequest } from '../types/Request';
import { prisma } from '../../../../config/database';
import { ok, badRequest } from '../../../helpers/JSONAPIResponse';

/**
 * @todo abstract these filter types to its own domain space
 * look at adding global filters for other endpoints
 */

type Filters = {
  sort: {
    dateCreated: 'asc' | 'desc';
  };
  include?: 'subLinks';
};

/**
 * @todo Controller has a lot going on I would abstract out filtering e.g we should be able to do all types of filter based on properties
 * when the controller does get too "fat" we should look at abstracting out into a service layer to handle business logic it seems okayish right now
 */

export const getLinks = async (req: CustomRequest, res: Response) => {
  const { userId } = req.query;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json(badRequest(errors.array()));
  }

  const { sort } = req.query as Filters;

  const includeSublinks = req.query.include === 'subLinks';

  try {
    const links = await prisma.link.findMany({
      where: { userId: userId as string },
      orderBy: { ...sort },
      include: includeSublinks ? { subLinks: { include: { show: true, music: true } } } : undefined,
    });

    res.status(200).json(ok({ links }));
  } catch (error) {
    /**
     * @todo I would generally opt for using a logger and send these logs to SumoLogic or Datadog whatever thirdparty we are using
     */
    // Logger.log({meaningful: logs});
    return 'error';
  }
};

export const createLink = (req: CustomRequest, res: Response) => {};
