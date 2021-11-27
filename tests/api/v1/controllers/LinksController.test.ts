import { getMockReq, getMockRes } from '@jest-mock/express';
import { LinkType } from '@prisma/client';
import * as Controller from '../../../../src/api/v1/controllers/LinksController';
import { prisma } from '../../../../config/database';

const { res, mockClear } = getMockRes() as any;

beforeEach(() => {
  mockClear();
  jest.clearAllMocks();
});

describe('GET LinksController', () => {
  it('should return links', async () => {
    const req = getMockReq({ userId: '123' }) as any;
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

  it('throws error', async () => {
    const req = getMockReq({ userId: '123' }) as any;

    jest.spyOn(prisma.link, 'findMany').mockImplementationOnce(() => {
      throw new Error('error');
    });

    const response = await Controller.getLinks(req, res);

    expect(response).toBe('error');
  });
});

describe('POST linksController', () => {
  it('creates link', async () => {
    const req = getMockReq({ userId: '123' }) as any;
    const link = {
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
    };

    jest.spyOn(prisma.link, 'create').mockResolvedValueOnce(link);

    await Controller.createLink(req, res);

    expect(res.json).toBeCalledWith({ status: 200, statusMessage: 'success', data: { link } });
  });
});
