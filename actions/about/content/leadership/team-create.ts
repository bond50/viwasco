'use server';

import { Prisma } from '@/generated/prisma/client';
import { executeAction } from '@/lib/actions/execute-action';
import { db } from '@/lib/db';
import { jsonForPrisma, jsonForPrismaRequired } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';

import {
  managementTeamCreateSchema,
  type ManagementTeamCreateValues,
} from '@/lib/schemas/about/content/leadership';
import {
  asSocialLinksArray,
  computeUniqueTeamSlug,
  TEAM_REVALIDATE_PATH,
  TEAM_REVALIDATE_TAGS,
} from './team-shared';

export const createTeamMember = async (
  _prev: ActionState<ManagementTeamCreateValues>,
  formData: FormData,
) => {
  return executeAction<ManagementTeamCreateValues>({
    schema: managementTeamCreateSchema,
    formData,
    jsonFields: ['image', 'socialLinks'],
    booleanFields: ['isFeatured'],
    numberFields: ['rank'],
    execute: async (data) => {
      const nextRank =
        typeof data.rank === 'number'
          ? data.rank
          : await db.managementTeam
              .aggregate({
                _max: { rank: true },
                where: { categoryId: data.categoryId },
              })
              .then((res) => (res._max.rank ?? 0) + 1);

      const slug = await computeUniqueTeamSlug(data.name);
      const socialLinks = asSocialLinksArray(data.socialLinks);

      const patch: Prisma.ManagementTeamCreateInput = {
        category: { connect: { id: data.categoryId } },
        name: data.name,
        position: data.position,
        bio: data.bio,
        slug,
        image: jsonForPrismaRequired(data.image),
        rank: nextRank,
        isFeatured: Boolean(data.isFeatured),
        isActive: true,
        socialLinks: jsonForPrisma(socialLinks),
        metadata: jsonForPrisma({
          visibilityFlags: {
            showBio: true,
            showWorkingHours: true,
            showEducation: true,
            showExperience: true,
            showAchievements: true,
            showPublications: true,
            showLists: true,
          },
        }),
      };

      await db.managementTeam.create({ data: patch });
    },
    revalidateTags: TEAM_REVALIDATE_TAGS.slice(),
    revalidatePaths: [TEAM_REVALIDATE_PATH],
  });
};
