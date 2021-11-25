import { Response } from 'express';

export const setCookieToken = (res: Response, token: string) => {
  res.cookie('accessToken', token, {
    expires: new Date(Date.now() + 99999999999),
    secure: false, // set to true if your using https
    httpOnly: true,
  });
};
