'use server';

import type { ActionState } from '@/lib/types/action-state';
import { executeAction } from '@/lib/actions/execute-action';
import { TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';
import { db } from '@/lib/db';
import { Prisma } from '@/generated/prisma/client';
import {
  TeamPublicationFormValues,
  teamPublicationSchema,
} from '@/lib/schemas/about/content/leadership';

export const saveTeamPublication = async (
  _prev: ActionState<TeamPublicationFormValues>,
  formData: FormData,
) => {
  return executeAction<TeamPublicationFormValues>({
    schema: teamPublicationSchema,
    formData,
    numberFields: ['year'],
    jsonFields: ['metadata'],
    execute: async (data) => {
      const { id, teamId, title, url, year } = data;

      let rank: number | undefined;

      if (!id) {
        const last = await db.teamPublication.findFirst({
          where: { teamId },
          select: { rank: true },
          orderBy: { rank: 'desc' },
        });
        rank = (last?.rank ?? 0) + 1;
      }

      const payload: Prisma.TeamPublicationUncheckedCreateInput = {
        teamId,
        title,
        url: url ?? null,
        year: year ?? null,
        rank: rank ?? 1,
      };

      if (!id) {
        await db.teamPublication.create({ data: payload });
      } else {
        await db.teamPublication.update({
          where: { id },
          data: payload,
        });
      }
    },
    revalidatePaths: [TEAM_REVALIDATE_PATH],
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
  });
};

export const deleteTeamPublication = async (id: string) => {
  'use server';
  await db.teamPublication.delete({ where: { id } });

  return {
    revalidatePaths: [TEAM_REVALIDATE_PATH],
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
  };
};
