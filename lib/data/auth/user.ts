import { db } from '@/lib/db';

export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({
      where: {
        email,
      },
    });
  } catch {
    return null;
  }
};

export const getUserById = async (id: string | undefined) => {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
    });
  } catch {
    return null;
  }
};

export const getUsersForSelect = async (): Promise<
  { id: string; name: string; email: string }[]
> => {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { name: 'asc' },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name || 'Unnamed',
    email: user.email ?? '',
  }));
};
