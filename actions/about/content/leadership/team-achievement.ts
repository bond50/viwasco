'use server';

import type { ActionState } from '@/lib/types/action-state';
import { executeAction } from '@/lib/actions/execute-action';
import { TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';
import { db } from '@/lib/db';
import { Prisma } from '@/generated/prisma/client';
import {
  TeamAchievementFormValues,
  teamAchievementSchema,
} from '@/lib/schemas/about/content/leadership';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import { getNextRank, reorderAfterDelete } from '@/lib/ranking';

function toCreateData(
  data: TeamAchievementFormValues,
  nextRank: number,
): Prisma.TeamAchievementUncheckedCreateInput {
  return {
    teamId: data.teamId,
    title: data.title,
    issuer: data.issuer ?? null,
    year: data.year ?? null,
    description: data.description ?? null,
    logo: jsonForPrisma(data.logo ?? null),
    rank: nextRank,
  };
}

function toUpdateData(data: TeamAchievementFormValues): Prisma.TeamAchievementUpdateInput {
  const base: Prisma.TeamAchievementUpdateInput = {
    title: data.title,
    issuer: data.issuer ?? null,
    year: data.year ?? null,
    description: data.description ?? null,
  };

  // Logo is optional; only touch it if it was present in the payload
  if (typeof data.logo !== 'undefined') {
    base.logo = jsonForPrisma(data.logo ?? null);
  }

  // Allow manual rank override if you ever add it to the form
  if (typeof data.rank === 'number') {
    base.rank = data.rank;
  }

  return base;
}

export const saveTeamAchievement = async (
  _prev: ActionState<TeamAchievementFormValues>,
  formData: FormData,
) => {
  return executeAction<TeamAchievementFormValues>({
    schema: teamAchievementSchema,
    formData,
    numberFields: ['year', 'rank'],
    jsonFields: ['logo'],
    execute: async (data) => {
      const { id, teamId } = data;

      if (!id) {
        // New achievement → compute rank
        const nextRank =
          typeof data.rank === 'number'
            ? data.rank
            : await getNextRank('teamAchievement', { teamId });

        await db.teamAchievement.create({
          data: toCreateData(data, nextRank),
        });
      } else {
        // Existing achievement → update, but do not touch teamId here
        await db.teamAchievement.update({
          where: { id },
          data: toUpdateData(data),
        });
      }
    },
    revalidatePaths: [TEAM_REVALIDATE_PATH],
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
  });
};

export const deleteTeamAchievement = async (id: string) => {
  'use server';

  const row = await db.teamAchievement.findUnique({
    where: { id },
    select: { rank: true, teamId: true },
  });

  if (!row) {
    return {
      revalidatePaths: [TEAM_REVALIDATE_PATH],
      revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
    };
  }

  await db.teamAchievement.delete({ where: { id } });

  if (typeof row.rank === 'number') {
    // Re-pack ranks for this team only
    await reorderAfterDelete('teamAchievement', { teamId: row.teamId }, row.rank);
  }

  return {
    revalidatePaths: [TEAM_REVALIDATE_PATH],
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
  };
};
