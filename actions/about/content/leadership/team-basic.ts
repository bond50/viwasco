'use server';

import { Prisma } from '@/generated/prisma/client';
import { executeAction } from '@/lib/actions/execute-action';
import { db } from '@/lib/db';
import { jsonForPrismaRequired } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';

import {
  managementTeamBasicSchema,
  type ManagementTeamBasicValues,
} from '@/lib/schemas/about/content/leadership';
import { computeUniqueTeamSlug, TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';

export const updateTeamMemberBasic = async (
  id: string,
  _prev: ActionState<ManagementTeamBasicValues>,
  formData: FormData,
) => {
  return executeAction<ManagementTeamBasicValues>({
    schema: managementTeamBasicSchema,
    formData,
    jsonFields: ['image'],
    booleanFields: ['isFeatured', 'isActive'],
    numberFields: ['rank'],
    execute: async (data) => {
      const slug = await computeUniqueTeamSlug(data.name, id);

      const patch: Prisma.ManagementTeamUpdateInput = {
        category: { connect: { id: data.categoryId } },
        name: data.name,
        position: data.position,
        slug,
        isFeatured: Boolean(data.isFeatured),
        isActive: Boolean(data.isActive ?? true),
      };

      if (typeof data.rank === 'number') {
        patch.rank = data.rank;
      }

      if (typeof data.image !== 'undefined' && data.image !== null) {
        patch.image = jsonForPrismaRequired(data.image);
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
