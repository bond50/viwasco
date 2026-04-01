'use server';

import type { ActionState } from '@/lib/types/action-state';
import { executeAction } from '@/lib/actions/execute-action';
import { db } from '@/lib/db';
import type { Prisma } from '@/generated/prisma/client';
import {
  managementTeamFlagsSchema,
  type ManagementTeamFlagsValues,
} from '@/lib/schemas/about/content/leadership';
import { TEAM_REVALIDATE_PATH, TEAM_REVALIDATE_TAGS } from './team-shared';

export const updateTeamMemberFlags = async (
  id: string,
  _prev: ActionState<ManagementTeamFlagsValues>,
  formData: FormData,
) => {
  return executeAction<ManagementTeamFlagsValues>({
    schema: managementTeamFlagsSchema,
    formData,
    booleanFields: [
      'isFeatured',
      'isActive',
      'showEmail',
      'showPhone',
      'showSocialLinks',
      'allowContact',
      'showBio',
      'showWorkingHours',
      'showEducation',
      'showExperience',
      'showAchievements',
      'showPublications',
      'showLists',
    ],
    execute: async (data) => {
      // Get current email + metadata so we can enforce rules & merge flags
      const existing = await db.managementTeam.findUnique({
        where: { id },
        select: { email: true, metadata: true },
      });

      if (!existing) {
        throw new Error('Team member not found');
      }

      // Rule: contact form requires email
      if (data.allowContact && !existing.email) {
        throw new Error(
          'Provide an email address in the Contact tab before enabling the contact form.',
        );
      }

      const patch: Prisma.ManagementTeamUpdateInput = {};

      const setBool = <K extends keyof Prisma.ManagementTeamUpdateInput>(
        field: K,
        value: boolean | undefined,
      ) => {
        if (typeof value === 'boolean') {
          patch[field] = value;
        }
      };

      // Core status
      setBool('isFeatured', data.isFeatured);
      setBool('isActive', data.isActive);

      // Contact visibility (same fields as contact tab)
      setBool('showEmail', data.showEmail);
      setBool('showPhone', data.showPhone);
      setBool('showSocialLinks', data.showSocialLinks);
      setBool('allowContact', data.allowContact);

      // Section flags → metadata.visibilityFlags
      const existingMeta = (existing.metadata as Record<string, unknown> | null) ?? {};
      const existingVisibility =
        (existingMeta.visibilityFlags as Record<string, unknown> | undefined) ?? {};

      const visibilityFlags = {
        showBio:
          typeof data.showBio === 'boolean'
            ? data.showBio
            : ((existingVisibility.showBio as boolean | undefined) ?? true),
        showWorkingHours:
          typeof data.showWorkingHours === 'boolean'
            ? data.showWorkingHours
            : ((existingVisibility.showWorkingHours as boolean | undefined) ?? true),
        showEducation:
          typeof data.showEducation === 'boolean'
            ? data.showEducation
            : ((existingVisibility.showEducation as boolean | undefined) ?? true),
        showExperience:
          typeof data.showExperience === 'boolean'
            ? data.showExperience
            : ((existingVisibility.showExperience as boolean | undefined) ?? true),
        showAchievements:
          typeof data.showAchievements === 'boolean'
            ? data.showAchievements
            : ((existingVisibility.showAchievements as boolean | undefined) ?? true),
        showPublications:
          typeof data.showPublications === 'boolean'
            ? data.showPublications
            : ((existingVisibility.showPublications as boolean | undefined) ?? true),
        showLists:
          typeof data.showLists === 'boolean'
            ? data.showLists
            : ((existingVisibility.showLists as boolean | undefined) ?? true),
      };

      patch.metadata = {
        ...existingMeta,
        visibilityFlags,
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
