import { Router } from 'express';
import { check } from 'express-validator/check';
import { login } from '../controllers/LoginController';

export const loginRouter = Router();

const loginValidations = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];
loginRouter.post('', loginValidations, login);
