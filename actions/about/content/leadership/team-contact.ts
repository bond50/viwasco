'use server';

import { Prisma } from '@/generated/prisma/client';
import { executeAction } from '@/lib/actions/execute-action';
import { db } from '@/lib/db';
import type { ActionState } from '@/lib/types/action-state';

import {
  managementTeamContactSchema,
  type ManagementTeamContactValues,
} from '@/lib/schemas/about/content/leadership';
import { TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';
import { jsonForPrisma } from '@/lib/actions/json-helpers';

export const updateTeamMemberContact = async (
  id: string,
  _prev: ActionState<ManagementTeamContactValues>,
  formData: FormData,
) => {
  return executeAction<ManagementTeamContactValues>({
    schema: managementTeamContactSchema,
    formData,
    booleanFields: ['showEmail', 'showPhone', 'showSocialLinks', 'allowContact'],
    jsonFields: ['workingHours'], // 👈 parses JSON from hidden input

    execute: async (data) => {
      const patch: Prisma.ManagementTeamUpdateInput = {
        email: data.email ?? null,
        phone: data.phone ?? null,
        expertiseArea: data.expertiseArea ?? null,
        officeLocation: data.officeLocation ?? null,
        assistantContact: data.assistantContact ?? null,

        // JSON working hours
        workingHours: jsonForPrisma(data.workingHours),
        showEmail: Boolean(data.showEmail),
        showPhone: Boolean(data.showPhone),
        showSocialLinks: Boolean(
          typeof data.showSocialLinks === 'boolean' ? data.showSocialLinks : true,
        ),
        allowContact: Boolean(data.allowContact),
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
