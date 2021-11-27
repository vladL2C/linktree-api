import { Router } from 'express';
import { getLinks, createLink, createMusicLink, createShowLink } from '../controllers/LinksController';

const { query } = require('express-validator/check');

export const linksRouter = Router();

/**
 * @todo Add proper error messages for the client something more meaningful at the moment its just defaults
 * I think i would opt in for something like {@link https://github.com/colinhacks/zod} for schema validation and typesaftey
 * express-validator seemed like the quick and dirty
 */

const validations = [
  query('sort')
    .optional()
    .custom(value => 'dateCreated' in value),
  query('sort.dateCreated').optional().isIn(['asc', 'desc']),
  query('userId').isUUID(),
  query('include')
    .optional()
    .custom(value => value === 'subLinks'),
];

linksRouter.get('', validations, getLinks);
linksRouter.post('', createLink);
linksRouter.post('/show', createShowLink);
linksRouter.post('/music', createMusicLink);
