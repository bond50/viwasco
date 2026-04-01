// actions/about/content/awards.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import { orgAwardSchema } from '@/lib/schemas/about/content/awards';
import type { ActionState } from '@/lib/types/action-state';
import type { OrgAwardFormValues } from '@/lib/types/about/content';
import { bulkReorder, getNextRank, reorderAfterDelete } from '@/lib/ranking';
import { ABOUT_AWARDS_TAG, ABOUT_NAV_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/about/awards';

function toCreateData(
  data: OrgAwardFormValues,
  nextRank: number,
): Prisma.OrganizationAwardCreateInput {
  return {
    title: data.title,
    issuer: data.issuer ?? null,
    date: data.date ?? null,
    summary: data.summary ?? null,
    badge: jsonForPrisma(data.badge ?? null),
    rank: nextRank,
  };
}

function toUpdateData(data: OrgAwardFormValues): Prisma.OrganizationAwardUpdateInput {
  const base: Prisma.OrganizationAwardUpdateInput = {
    title: data.title,
    issuer: data.issuer ?? null,
    date: data.date ?? null,
    summary: data.summary ?? null,
  };
  if (typeof data.badge !== 'undefined') base.badge = jsonForPrisma(data.badge ?? null);
  if (typeof data.rank === 'number') base.rank = data.rank;
  return base;
}

export const createOrgAward = async (
  _prev: ActionState<OrgAwardFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgAwardFormValues>({
    schema: orgAwardSchema,
    formData,
    fileFields: ['badge'],
    dateFields: ['date'],
    numberFields: ['rank'],
    execute: async (data) => {
      const nextRank =
        typeof data.rank === 'number' ? data.rank : await getNextRank('organizationAward');

      await db.organizationAward.create({ data: toCreateData(data, nextRank) });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_AWARDS_TAG, ABOUT_NAV_TAG],
  });
};

export const updateOrgAward = async (
  id: string,
  _prev: ActionState<OrgAwardFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgAwardFormValues>({
    schema: orgAwardSchema,
    formData,
    fileFields: ['badge'],
    dateFields: ['date'],
    numberFields: ['rank'],
    execute: async (data) => {
      await db.organizationAward.update({ where: { id }, data: toUpdateData(data) });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_AWARDS_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteOrgAward = async (id: string) => {
  await requireCurrentUser();

  const row = await db.organizationAward.findUnique({ where: { id }, select: { rank: true } });
  if (!row) return;

  await db.organizationAward.delete({ where: { id } });
  if (typeof row.rank === 'number') {
    await reorderAfterDelete('organizationAward', {}, row.rank);
  }

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidatePath('/about/awards');
  revalidateTag(ABOUT_AWARDS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderOrgAwards = async (updates: { id: string; rank: number }[]) => {
  await requireCurrentUser();
  await bulkReorder('organizationAward', {}, updates);
  revalidatePath(REVALIDATE_DASHBOARD);
  revalidatePath('/about/awards');
  revalidateTag(ABOUT_AWARDS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
