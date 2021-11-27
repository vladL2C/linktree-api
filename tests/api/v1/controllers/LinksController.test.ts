import { getMockReq, getMockRes } from '@jest-mock/express';
import { LinkType } from '@prisma/client';
import * as Controller from '../../../../src/api/v1/controllers/LinksController';
import { prisma } from '../../../../config/database';

const req = getMockReq({ userId: '123' }) as any;
const { res, mockClear } = getMockRes() as any;
beforeEach(() => {
  mockClear();
});

describe('LinksController', () => {
  it('should return links', async () => {
    const links = [
      {
        id: '123',
        title: 'my first classic link',
        type: LinkType.Classic,
        active: true,
        url: 'https://hasura.io/',
        embed: false,
        userId: '123',
        thumbnail: null,
        dateCreated: new Date(),
        updatedAt: null,
        sublinkId: null,
      },
    ];

    jest.spyOn(prisma.link, 'findMany').mockResolvedValueOnce(links);

    await Controller.getLinks(req, res);

    expect(res.json).toBeCalledWith({ status: 200, statusMessage: 'success', data: { links } });
  });
});
