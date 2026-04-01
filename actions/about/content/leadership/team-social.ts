'use server';

import { Prisma } from '@/generated/prisma/client';
import { executeAction } from '@/lib/actions/execute-action';
import { db } from '@/lib/db';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';

import {
  managementTeamSocialSchema,
  type ManagementTeamSocialValues,
} from '@/lib/schemas/about/content/leadership';
import { asSocialLinksArray, TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';

export const updateTeamMemberSocial = async (
  id: string,
  _prev: ActionState<ManagementTeamSocialValues>,
  formData: FormData,
) => {
  return executeAction<ManagementTeamSocialValues>({
    schema: managementTeamSocialSchema,
    formData,
    jsonFields: ['socialLinks'],
    execute: async (data) => {
      const normalized = asSocialLinksArray(data.socialLinks);

      const patch: Prisma.ManagementTeamUpdateInput = {
        socialLinks: jsonForPrisma(normalized),
      };

      await db.managementTeam.update({
        where: { id },
        data: patch,
      });
    },
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
    revalidatePaths: [TEAM_REVALIDATE_PATH],
  });
};
