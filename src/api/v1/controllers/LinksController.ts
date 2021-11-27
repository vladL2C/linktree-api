import { Response } from 'express';
import { validationResult } from 'express-validator/check';
import HttpStatusCodes from 'http-status-codes';
import { CustomRequest } from '../types/Request';
import { prisma } from '../../../../config/database';
import { ok, badRequest } from '../../../helpers/JSONAPIResponse';

/**
 * @todo Add JSON Serializers and deserializers
 * @todo conform to the JSON API Standards {@link https://jsonapi.org/} or try your best to anways :D
 */

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

  // went for a filter incase we want flat structure and don't want the sublinks to be included and can let clients or consuming services handle it anyway they like
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

/**
 * @todo Add body validation to make sure client is sending the correct data
 * @todo handle title validation if its more than 144 characters
 * this handles all types of links being created but I opted for separate endpoints to build the associations seems like an easy separation but also
 * I think we could handle the associations in this controller to just pass in the required parameters and build out a service layer to help with the business logic to handle that
 * since I have structured it towards self referential association Parent -> Child Links
 */
export const createLink = async (req: CustomRequest, res: Response) => {
  try {
    const request = req.body;
    const link = await prisma.link.create({ data: request });
    res.status(201).json(ok({ link }));
  } catch (error) {
    console.log(error);
    return 'errrr';
  }
};

export const createShowLink = async (req: CustomRequest, res: Response) => {
  /**
   * @todo validations on the request body for what is expected and handle errors
   * @todo handle title validation if its more than 144 characters currently it'll just throw at the database layer
   */

  try {
    const { sublinkId, userId, type, title, active, url, embed } = req.body;
    const { show } = req.body;

    const link = await prisma.link.create({
      data: {
        sublinkId,
        userId,
        type,
        title,
        active,
        url,
        embed,
        show: { create: { ...show, date: new Date(show.date) } },
      },
      include: { show: true },
    });

    res.status(201).json(ok({ link }));
  } catch (error) {
    console.log(error);
    return 'errrr';
  }
};

export const createMusicLink = async (req: CustomRequest, res: Response) => {
  /**
   * @todo validations on the request body for what is expected and handle errors
   * @todo handle title validation if its more than 144 characters currently it'll just throw at the database layer
   */

  try {
    const { sublinkId, userId, type, title, active, url, embed } = req.body;
    const { music } = req.body;

    const link = await prisma.link.create({
      data: {
        sublinkId,
        userId,
        type,
        title,
        active,
        url,
        embed,
        music: { create: music },
      },
      include: { music: true },
    });

    res.status(201).json(ok({ link, music }));
  } catch (error) {
    console.log(error);
    return 'errrr';
  }
};
