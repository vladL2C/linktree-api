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
  // await seedDatabase();
  const links = await prisma.link.findMany({
    where: { userId: 'b7f2377b-4baf-42b6-b3bf-c9cfb1105b3e' },
  });

  console.log(links);
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
