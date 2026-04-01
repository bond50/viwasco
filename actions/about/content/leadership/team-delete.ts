'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { revalidateTeamsAll, secureMutatingAction } from './team-shared';

export const deleteTeamMember = async (id: string) => {
  await secureMutatingAction();
  const linkedMessage = await db.organizationMessage.findUnique({
    where: { authorTeamId: id },
    select: { id: true },
  });
  if (linkedMessage) {
    throw new Error(
      'Cannot delete this team member because they are linked to an organization message. Reassign or delete that message first.',
    );
  }

  try {
    await db.managementTeam.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      throw new Error(
        'Cannot delete this team member because they are linked to other records. Remove those links and try again.',
      );
    }
    throw err;
  }
  revalidateTeamsAll();
};
