import HttpStatusCodes from 'http-status-codes';

export const ok = <T>(data: T) => ({ data, status: HttpStatusCodes.OK, statusMessage: 'success' });

export const notFound = <T>(data: T) => ({
  errors: data,
  status: HttpStatusCodes.NOT_FOUND,
  statusMessage: 'error',
});

export const badRequest = <T>(data: T) => ({
  errors: data,
  status: HttpStatusCodes.BAD_REQUEST,
  statusMessage: 'error',
});

export const unAuthorized = <T>(data: T) => ({
  errors: data,
  status: HttpStatusCodes.UNAUTHORIZED,
  statusMessage: 'error',
});
