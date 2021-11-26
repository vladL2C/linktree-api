import bcrypt from 'bcryptjs';
import { LinkType, ShowStatus, Platform } from '@prisma/client';
import faker from 'faker';

/**
 * @todo Separate this into separate mocks folder can be re used for unit testing
 */

const generateShow = () => ({
  status: ShowStatus.OnSale,
  venue: faker.lorem.word(),
  location: faker.address.streetAddress(),
});

const generateMusic = () => ({
  platform: Platform.YouTube,
});

export const generateClassicLinks = () => [
  {
    title: 'my first classic link',
    type: LinkType.Classic,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
  {
    title: 'my second classic  link',
    type: LinkType.Classic,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
  {
    title: 'my third classic  link',
    type: LinkType.Classic,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
];

export const generateShowLinks = () => [
  {
    title: 'my first show link',
    type: LinkType.Show,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
    show: { create: generateShow() },
  },
  {
    title: 'my second show link',
    type: LinkType.Show,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
    show: { create: generateShow() },
  },
  {
    title: 'my third show link',
    type: LinkType.Show,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
    show: { create: generateShow() },
  },
];

export const generateMusicLinks = () => [
  {
    title: 'my first music player link',
    type: LinkType.MusicPlayer,
    active: true,
    url: 'https://music.youtube.com/watch?v=342Msc1FQUU',
    embed: false,
    music: { create: generateMusic() },
  },
  {
    title: 'my second music player link',
    type: LinkType.MusicPlayer,
    active: true,
    url: 'https://music.youtube.com/watch?v=342Msc1FQUU',
    embed: false,
    music: { create: generateMusic() },
  },
  {
    title: 'my third music player link',
    type: LinkType.MusicPlayer,
    active: true,
    url: 'https://music.youtube.com/watch?v=342Msc1FQUU',
    embed: true,
    music: { create: generateMusic() },
  },
];

export const generateUser = async () => {
  const salt = await bcrypt.genSalt(10);
  const password = 'password';
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = {
    email: 'test@example.com',
    password: hashedPassword,
    firstName: 'Bat',
    lastName: 'Man',
  };

  return user;
};
