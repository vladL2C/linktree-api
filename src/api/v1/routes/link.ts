import { Router } from 'express';
import { getLinks } from '../controllers/LinksController';

export const linksRouter = Router();

linksRouter.get('', getLinks);
