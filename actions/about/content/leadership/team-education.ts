'use server';

import type { ActionState } from '@/lib/types/action-state';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import { TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';
import { db } from '@/lib/db';
import { Prisma } from '@/generated/prisma/client';
import {
  TeamEducationFormValues,
  teamEducationSchema,
} from '@/lib/schemas/about/content/leadership';
import { getNextRank, reorderAfterDelete } from '@/lib/ranking';

function toCreateData(
  data: TeamEducationFormValues,
  nextRank: number,
): Prisma.TeamEducationUncheckedCreateInput {
  return {
    teamId: data.teamId,
    institution: data.institution,
    qualification: data.qualification ?? null,
    level: data.level ?? null,
    field: data.field ?? null,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    isCurrent: Boolean(data.isCurrent),
    description: data.description ?? null,
    honor: data.honor ?? null,
    logo: jsonForPrisma(data.logo ?? null),
    rank: nextRank,
  };
}

function toUpdateData(data: TeamEducationFormValues): Prisma.TeamEducationUpdateInput {
  const base: Prisma.TeamEducationUpdateInput = {
    institution: data.institution,
    qualification: data.qualification ?? null,
    level: data.level ?? null,
    field: data.field ?? null,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    isCurrent: Boolean(data.isCurrent),
    description: data.description ?? null,
    honor: data.honor ?? null,
  };

  if (typeof data.logo !== 'undefined') {
    base.logo = jsonForPrisma(data.logo ?? null);
  }

  // 🔹 We do NOT touch rank from the form (no rank field in schema).
  return base;
}

export const saveTeamEducation = async (
  _prev: ActionState<TeamEducationFormValues>,
  formData: FormData,
) => {
  return executeAction<TeamEducationFormValues>({
    schema: teamEducationSchema,
    formData,
    jsonFields: ['logo'],
    booleanFields: ['isCurrent'],
    execute: async (data) => {
      const { id, teamId } = data;

      if (!id) {
        // New row → compute next rank scoped to this team
        const nextRank = await getNextRank('teamEducation', { teamId });

        await db.teamEducation.create({
          data: toCreateData(data, nextRank),
        });
      } else {
        // Existing row → update only fields, keep teamId + rank as-is
        await db.teamEducation.update({
          where: { id },
          data: toUpdateData(data),
        });
      }
    },
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
    revalidatePaths: [TEAM_REVALIDATE_PATH],
  });
};

export const deleteTeamEducation = async (id: string) => {
  'use server';

  const row = await db.teamEducation.findUnique({
    where: { id },
    select: { rank: true, teamId: true },
  });

  if (!row) {
    return {
      revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
      revalidatePaths: [TEAM_REVALIDATE_PATH],
    };
  }

  await db.teamEducation.delete({ where: { id } });

  if (typeof row.rank === 'number') {
    await reorderAfterDelete('teamEducation', { teamId: row.teamId }, row.rank);
  }

  return {
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
    revalidatePaths: [TEAM_REVALIDATE_PATH],
  };
};
