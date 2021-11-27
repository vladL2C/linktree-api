import { ok, notFound, badRequest } from '../../src/helpers/JSONAPIResponse';

describe('JSONAPIResponse helpers', () => {
  it('responds with ok 200', () => {
    expect(ok('hello')).toStrictEqual({ data: 'hello', status: 200, statusMessage: 'success' });
  });

  it('responds with not found 404', () => {
    expect(notFound('hello')).toStrictEqual({ errors: 'hello', status: 404, statusMessage: 'error' });
  });

  it('responds with not found 400', () => {
    expect(badRequest('hello')).toStrictEqual({ errors: 'hello', status: 400, statusMessage: 'error' });
  });
});
