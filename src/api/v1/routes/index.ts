import { Router } from 'express';
import { loginRouter } from './login';
import { registerRouter } from './register';
import { authenticate } from '../middleware/auth';
import { linksRouter } from './link';

export const publicRouter = Router();
export const authenticatedRouter = Router();

const BASE_API_URL = '/api/v1' as const;

// public routes
publicRouter.use(`${BASE_API_URL}/login`, loginRouter);
publicRouter.use(`${BASE_API_URL}/register`, registerRouter);

// authenticated routes
authenticatedRouter.use(authenticate);
linksRouter.use(`${BASE_API_URL}/links`, linksRouter);
