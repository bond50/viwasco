'use server';

import { Prisma } from '@/generated/prisma/client';
import { executeAction } from '@/lib/actions/execute-action';
import { db } from '@/lib/db';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';

import {
  managementTeamProfileSchema,
  type ManagementTeamProfileValues,
} from '@/lib/schemas/about/content/leadership';
import { TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';

export const updateTeamMemberProfile = async (
  id: string,
  _prev: ActionState<ManagementTeamProfileValues>,
  formData: FormData,
) => {
  return executeAction<ManagementTeamProfileValues>({
    schema: managementTeamProfileSchema,
    formData,
    jsonFields: ['publications', 'metadata'],
    execute: async (data) => {
      const patch: Prisma.ManagementTeamUpdateInput = {
        bio: data.bio,
        experience: data.experience ?? null,
        achievements: data.achievements ?? null,
      };

      if (typeof data.publications !== 'undefined') {
        patch.publications = jsonForPrisma(data.publications ?? null);
      }

      if (typeof data.metadata !== 'undefined') {
        patch.metadata = jsonForPrisma(data.metadata ?? null);
      }

      await db.managementTeam.update({
        where: { id },
        data: patch,
      });
    },
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
    revalidatePaths: [TEAM_REVALIDATE_PATH],
  });
};
