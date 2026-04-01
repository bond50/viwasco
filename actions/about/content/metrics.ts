// actions/about/content/metrics.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';
import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { orgMetricSchema } from '@/lib/schemas/about/content/metrics';
import type { ActionState } from '@/lib/types/action-state';
import type { OrgMetricFormValues } from '@/lib/types/about/content';
import { bulkReorder, getNextRank, reorderAfterDelete } from '@/lib/ranking';
import { ABOUT_METRICS_TAG, ABOUT_NAV_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE = '/dashboard/about/metrics';

function toCreateData(
  data: OrgMetricFormValues,
  nextRank: number,
): Prisma.OrganizationMetricCreateInput {
  return {
    label: data.label,
    value: data.value,
    unit: data.unit ?? null,
    icon: data.icon ?? null,
    published: typeof data.published === 'boolean' ? data.published : true,
    rank: nextRank,
  };
}

function toUpdateData(data: OrgMetricFormValues): Prisma.OrganizationMetricUpdateInput {
  const base: Prisma.OrganizationMetricUpdateInput = {
    label: data.label,
    value: data.value,
    unit: data.unit ?? null,
    icon: data.icon ?? null,
  };
  if (typeof data.published === 'boolean') {
    base.published = data.published;
  }
  if (typeof data.rank === 'number') {
    base.rank = data.rank;
  }
  return base;
}

export const createOrgMetric = async (_p: ActionState<OrgMetricFormValues>, formData: FormData) => {
  return executeAction<OrgMetricFormValues>({
    schema: orgMetricSchema,
    formData,
    booleanFields: ['published'],
    numberFields: ['value', 'rank'],
    execute: async (data) => {
      const nextRank =
        typeof data.rank === 'number' ? data.rank : await getNextRank('organizationMetric');
      await db.organizationMetric.create({ data: toCreateData(data, nextRank) });
    },
    revalidate: REVALIDATE,
    revalidateTags: [ABOUT_METRICS_TAG, ABOUT_NAV_TAG],
  });
};

export const updateOrgMetric = async (
  id: string,
  _p: ActionState<OrgMetricFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgMetricFormValues>({
    schema: orgMetricSchema,
    formData,
    booleanFields: ['published'],
    numberFields: ['value', 'rank'],
    execute: async (data) => {
      await db.organizationMetric.update({ where: { id }, data: toUpdateData(data) });
    },
    revalidate: REVALIDATE,
    revalidateTags: [ABOUT_METRICS_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteOrgMetric = async (id: string) => {
  await requireCurrentUser();

  const row = await db.organizationMetric.findUnique({
    where: { id },
    select: { rank: true },
  });
  if (!row) return;

  await db.organizationMetric.delete({ where: { id } });
  if (typeof row.rank === 'number') {
    await reorderAfterDelete('organizationMetric', {}, row.rank);
  }
  revalidatePath(REVALIDATE);
  revalidateTag(ABOUT_METRICS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderOrgMetrics = async (updates: { id: string; rank: number }[]) => {
  await requireCurrentUser();

  await bulkReorder('organizationMetric', {}, updates);
  revalidatePath(REVALIDATE);
  revalidateTag(ABOUT_METRICS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
