import { prisma } from '../config/database';

import { generateUser, generateClassicLinks, generateMusicLinks, generateShowLinks } from './seedHelpers';

const seedDatabase = async () => {
  const user = await generateUser();

  await prisma.user.create({
    data: {
      ...user,
      links: {
        create: [...generateClassicLinks(), ...generateMusicLinks(), ...generateShowLinks()],
      },
    },
  });
};

const main = async () => {
  await seedDatabase();
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
