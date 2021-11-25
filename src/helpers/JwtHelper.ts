import jwt from 'jsonwebtoken';
import config from 'config';

export const generateToken = (payload: any) =>
  jwt.sign(payload, config.get('jwtSecret'), { expiresIn: config.get('jwtExpiration') });
