'use server';

import type { ActionState } from '@/lib/types/action-state';
import { executeAction } from '@/lib/actions/execute-action';
import { db } from '@/lib/db';
import { Prisma } from '@/generated/prisma/client';
import { TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';
import {
  TeamExperienceFormValues,
  teamExperienceSchema,
} from '@/lib/schemas/about/content/leadership';
import { getNextRank, reorderAfterDelete } from '@/lib/ranking';

function toCreateData(
  data: TeamExperienceFormValues,
  nextRank: number,
): Prisma.TeamExperienceUncheckedCreateInput {
  return {
    teamId: data.teamId,
    role: data.role,
    organization: data.organization,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    description: data.description ?? null,
    achievements: data.achievements ?? [],
    isCurrent: Boolean(data.isCurrent),
    rank: nextRank,
  };
}

function toUpdateData(data: TeamExperienceFormValues): Prisma.TeamExperienceUpdateInput {
  const base: Prisma.TeamExperienceUpdateInput = {
    role: data.role,
    organization: data.organization,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    description: data.description ?? null,
    isCurrent: Boolean(data.isCurrent),
  };

  // scalar list must use { set: [...] }
  if (Array.isArray(data.achievements)) {
    base.achievements = { set: data.achievements };
  }

  // allow rank override later if you add it to the form
  if (typeof data.rank === 'number') {
    base.rank = data.rank;
  }

  return base;
}

export const saveTeamExperience = async (
  _prev: ActionState<TeamExperienceFormValues>,
  formData: FormData,
) => {
  return executeAction<TeamExperienceFormValues>({
    schema: teamExperienceSchema,
    formData,
    booleanFields: ['isCurrent'],
    numberFields: ['rank'],
    execute: async (data) => {
      const { id, teamId } = data;

      if (!id) {
        // New experience → compute next rank for this team
        const nextRank =
          typeof data.rank === 'number'
            ? data.rank
            : await getNextRank('teamExperience', { teamId });

        await db.teamExperience.create({
          data: toCreateData(data, nextRank),
        });
      } else {
        // Existing experience → update (do not touch teamId here)
        await db.teamExperience.update({
          where: { id },
          data: toUpdateData(data),
        });
      }
    },
    revalidatePaths: [TEAM_REVALIDATE_PATH],
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
  });
};

export const deleteTeamExperience = async (id: string) => {
  'use server';

  const row = await db.teamExperience.findUnique({
    where: { id },
    select: { rank: true, teamId: true },
  });

  if (!row) {
    return {
      revalidatePaths: [TEAM_REVALIDATE_PATH],
      revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
    };
  }

  await db.teamExperience.delete({ where: { id } });

  if (typeof row.rank === 'number') {
    await reorderAfterDelete('teamExperience', { teamId: row.teamId }, row.rank);
  }

  return {
    revalidatePaths: [TEAM_REVALIDATE_PATH],
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
  };
};
