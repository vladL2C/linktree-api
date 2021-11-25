import config from 'config';
import { Response, NextFunction } from 'express';
import HttpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../Enums/error';

import { CustomRequest } from '../types/Request';

export const authenticate = function (req: CustomRequest, res: Response, next: NextFunction) {
  // Get token from httpOnly cookie
  const { accessToken } = req.cookies;

  // Verify token
  if (!accessToken) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: AuthenticationError.MissingToken });
  }

  try {
    const payload: any = jwt.verify(accessToken, config.get('jwtSecret'));
    req.userId = payload.user.id;
    next();
  } catch (err) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: AuthenticationError.InvalidToken });
  }
};
