// actions/about/content/milestones.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import { orgMilestoneSchema } from '@/lib/schemas/about/content/milestones';
import type { ActionState } from '@/lib/types/action-state';
import type { OrgMilestoneFormValues } from '@/lib/types/about/content';
import { bulkReorder, getNextRank, reorderAfterDelete } from '@/lib/ranking';
import { ABOUT_MILESTONES_TAG, ABOUT_NAV_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/about/milestones';

function toCreateData(
  data: OrgMilestoneFormValues,
  nextRank: number,
): Prisma.OrganizationMilestoneCreateInput {
  return {
    title: data.title,
    summary: data.summary ?? null,
    year: typeof data.year === 'number' ? data.year : null,
    date: data.date ?? null,
    image: jsonForPrisma(data.image ?? null),
    rank: nextRank,
  };
}

function toUpdateData(data: OrgMilestoneFormValues): Prisma.OrganizationMilestoneUpdateInput {
  const base: Prisma.OrganizationMilestoneUpdateInput = {
    title: data.title,
    summary: data.summary ?? null,
  };

  if (typeof data.year === 'number') base.year = data.year;
  if (typeof data.date !== 'undefined') base.date = data.date ?? null;
  if (typeof data.image !== 'undefined') base.image = jsonForPrisma(data.image ?? null);
  if (typeof data.rank === 'number') base.rank = data.rank;

  return base;
}

export const createOrgMilestone = async (
  _prev: ActionState<OrgMilestoneFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgMilestoneFormValues>({
    schema: orgMilestoneSchema,
    formData,
    fileFields: ['image'],
    dateFields: ['date'],
    numberFields: ['year', 'rank'],
    execute: async (data) => {
      const nextRank =
        typeof data.rank === 'number' ? data.rank : await getNextRank('organizationMilestone');

      await db.organizationMilestone.create({ data: toCreateData(data, nextRank) });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_MILESTONES_TAG, ABOUT_NAV_TAG],
  });
};

export const updateOrgMilestone = async (
  id: string,
  _prev: ActionState<OrgMilestoneFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgMilestoneFormValues>({
    schema: orgMilestoneSchema,
    formData,
    fileFields: ['image'],
    dateFields: ['date'],
    numberFields: ['year', 'rank'],
    execute: async (data) => {
      await db.organizationMilestone.update({ where: { id }, data: toUpdateData(data) });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_MILESTONES_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteOrgMilestone = async (id: string) => {
  await requireCurrentUser();

  const row = await db.organizationMilestone.findUnique({
    where: { id },
    select: { rank: true },
  });
  if (!row) return;

  await db.organizationMilestone.delete({ where: { id } });
  if (typeof row.rank === 'number') {
    await reorderAfterDelete('organizationMilestone', {}, row.rank);
  }

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_MILESTONES_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderOrgMilestones = async (updates: { id: string; rank: number }[]) => {
  await requireCurrentUser();

  await bulkReorder('organizationMilestone', {}, updates);
  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_MILESTONES_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
