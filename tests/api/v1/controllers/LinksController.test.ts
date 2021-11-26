import { getMockReq, getMockRes } from '@jest-mock/express';
import * as Controller from '../../../../src/api/v1/controllers/LinksController';

const req = getMockReq() as any;
const { res, mockClear } = getMockRes() as any;
beforeEach(() => {
  mockClear();
});

describe('LinksController', () => {
  it('returns string', async () => {
    Controller.getLinks(req, res);

    expect(res.json).toBeCalledWith({ success: true, links: 'hello world' });
  });
});
