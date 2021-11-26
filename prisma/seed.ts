import { LinkType, Link } from '@prisma/client';
import { prisma } from '../config/database';

import { generateUser, generateClassicLinks, generateMusicLinks, generateShowLinks } from './seedHelpers';

type ChildLinkIds = {
  id: string;
};

const linkData = () => [...generateClassicLinks(), ...generateMusicLinks(), ...generateShowLinks()];

const createUser = async () => {
  const user = await generateUser();

  return prisma.user.create({ data: user });
};

const connectLinksToUser = async (userId: string, links: Link[]) => {
  const linkIds = links.map(link => ({ id: link.id }));
  await prisma.user.update({ where: { id: userId }, data: { links: { connect: linkIds } } });
};

const connectParentLinkToChildren = async (parentLinkId: string, childLinkIds: ChildLinkIds[]) => {
  await prisma.link.update({ where: { id: parentLinkId }, data: { subLinks: { connect: childLinkIds } } });
};

/**
 * @todo This can be improved to take separation of concerns into account
 * @todo there's a lot going on here and is very rough quite a lot of duplication also
 * @todo I would generally opt for using raw sql to create seed data it'll be faster than using the orm but will take more effort.
 */
const seedDatabase = async () => {
  const parentMusicLink = prisma.link.create({
    data: {
      title: 'parent music link',
      type: LinkType.MusicPlayer,
      active: true,
    },
  });

  const parentShowLink = prisma.link.create({
    data: { title: 'parent show link', type: LinkType.Show, active: true },
  });

  const [user, musicLink, showLink] = await Promise.all([createUser(), parentMusicLink, parentShowLink]);

  const createdLinks = [];

  for (const link of linkData()) {
    createdLinks.push(await prisma.link.create({ data: link }));
  }

  const musicLinkIds = createdLinks.filter(link => link.type === LinkType.MusicPlayer).map(link => ({ id: link.id }));
  const showLinkIds = createdLinks.filter(link => link.type === LinkType.Show).map(link => ({ id: link.id }));

  await Promise.all([
    connectLinksToUser(user.id, createdLinks),
    connectParentLinkToChildren(musicLink.id, musicLinkIds),
    connectParentLinkToChildren(showLink.id, showLinkIds),
  ]);
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
