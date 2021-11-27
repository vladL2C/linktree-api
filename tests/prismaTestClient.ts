import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
/**
 * @todo Recommended way to mock prisma but for some reason its not actually returning the resolved values
  opted for jest spyOn for now.
 */
import { prisma } from '../config/database';

jest.mock('../config/database', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
