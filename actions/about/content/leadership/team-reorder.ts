'use server';

import { bulkReorder } from '@/lib/ranking';
import { revalidateTeamsAll, secureMutatingAction } from './team-shared';

export const reorderTeamMembers = async (
  categoryId: string,
  updates: { id: string; rank: number }[],
) => {
  await secureMutatingAction();
  await bulkReorder('managementTeam', { categoryId }, updates);
  revalidateTeamsAll();
};
