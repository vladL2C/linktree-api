import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';
import { Response } from 'express';
import { CustomRequest } from '../types/Request';
import { prisma } from '../../../../config/database';
import { generateToken } from '../../../helpers/JwtHelper';
import { setCookieToken } from '../../../helpers/CookieHelper';
import { ok, badRequest } from '../../../helpers/JSONAPIResponse';

export const login = async (req: CustomRequest, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json(badRequest(errors.array()));
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(HttpStatusCodes.BAD_REQUEST).json(badRequest([{ msg: 'Invalid credentials' }]));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(HttpStatusCodes.BAD_REQUEST).json(badRequest([{ msg: 'Invalid credentials' }]));
    // this is where serializers and dto's come in handy we dont want to send password to clients even if its hashed...
    const payload = {
      user,
    };

    const token = generateToken(payload);
    setCookieToken(res, token);

    return res.json(ok(user));
  } catch (err) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};
