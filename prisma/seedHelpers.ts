import bcrypt from 'bcryptjs';
import { LinkType } from '@prisma/client';

export const generateClassicLinks = () => [
  {
    title: 'my first link',
    type: LinkType.Classic,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
  {
    title: 'my second link',
    type: LinkType.Classic,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
  {
    title: 'my third link',
    type: LinkType.Classic,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
];

export const generateShowLinks = () => [
  {
    title: 'my first link',
    type: LinkType.Show,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
  {
    title: 'my second link',
    type: LinkType.Show,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
  {
    title: 'my third link',
    type: LinkType.Show,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
];

export const generateMusicLinks = () => [
  {
    title: 'my first link',
    type: LinkType.MusicPlayer,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
  {
    title: 'my second link',
    type: LinkType.MusicPlayer,
    active: true,
    url: 'https://hasura.io/',
    embed: false,
  },
  {
    title: 'my third link',
    type: LinkType.MusicPlayer,
    active: true,
    url: 'https://hasura.io/',
    embed: true,
  },
];

export const generateUser = async () => {
  const salt = await bcrypt.genSalt(10);
  const password = 'password';
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = {
    email: 'vlad@example.com',
    password: hashedPassword,
    firstName: 'Bat',
    lastName: 'Man',
  };

  return user;
};
