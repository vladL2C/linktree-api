import bcrypt from 'bcryptjs';

export const generateUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const password = 'password';
  const hashedPassword = await bcrypt.hash(password, salt);

  const users = [
    {
      email: 'vlad@example.com',
      password: hashedPassword,
      firstName: 'Bat',
      lastName: 'Man',
    },
  ];

  return users;
};
