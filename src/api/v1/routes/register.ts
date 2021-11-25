import { Router } from 'express';
import { register } from '../controllers/RegisterController';

export const registerRouter = Router();

registerRouter.get('', register);
