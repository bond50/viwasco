'use server';

import { Prisma } from '@/generated/prisma/client';
import { executeAction } from '@/lib/actions/execute-action';
import { db } from '@/lib/db';
import type { ActionState } from '@/lib/types/action-state';

import {
  managementTeamListsSchema,
  type ManagementTeamListsValues,
} from '@/lib/schemas/about/content/leadership';
import { TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';

export const updateTeamMemberLists = async (
  id: string,
  _prev: ActionState<ManagementTeamListsValues>,
  formData: FormData,
) => {
  return executeAction<ManagementTeamListsValues>({
    schema: managementTeamListsSchema,
    formData,
    execute: async (data) => {
      const patch: Prisma.ManagementTeamUpdateInput = {};

      if (typeof data.languages !== 'undefined') {
        patch.languages = data.languages ?? [];
      }
      if (typeof data.boardCommittees !== 'undefined') {
        patch.boardCommittees = data.boardCommittees ?? [];
      }
      if (typeof data.professionalAffiliations !== 'undefined') {
        patch.professionalAffiliations = data.professionalAffiliations ?? [];
      }
      if (typeof data.awards !== 'undefined') {
        patch.awards = data.awards ?? [];
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
