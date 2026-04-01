// actions/about/content/testimonials.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import { orgTestimonialSchema } from '@/lib/schemas/about/content/testimonials';
import type { ActionState } from '@/lib/types/action-state';
import type { OrgTestimonialFormValues } from '@/lib/types/about/content';
import { bulkReorder, getNextRank, reorderAfterDelete } from '@/lib/ranking';
import { ABOUT_NAV_TAG, ABOUT_TESTIMONIALS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/about/testimonials';

function toCreateData(
  data: OrgTestimonialFormValues,
  nextRank: number,
): Prisma.OrganizationTestimonialCreateInput {
  return {
    authorName: data.authorName,
    authorRole: data.authorRole ?? null,
    message: data.message,
    avatar: jsonForPrisma(data.avatar ?? null),
    published: typeof data.published === 'boolean' ? data.published : true,
    rank: nextRank,
  };
}

function toUpdateData(data: OrgTestimonialFormValues): Prisma.OrganizationTestimonialUpdateInput {
  const base: Prisma.OrganizationTestimonialUpdateInput = {
    authorName: data.authorName,
    authorRole: data.authorRole ?? null,
    message: data.message,
  };

  if (typeof data.avatar !== 'undefined') base.avatar = jsonForPrisma(data.avatar ?? null);
  if (typeof data.published === 'boolean') base.published = data.published;
  if (typeof data.rank === 'number') base.rank = data.rank;

  return base;
}

export const createOrgTestimonial = async (
  _prev: ActionState<OrgTestimonialFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgTestimonialFormValues>({
    schema: orgTestimonialSchema,
    formData,
    fileFields: ['avatar'],
    booleanFields: ['published'],
    numberFields: ['rank'],
    execute: async (data) => {
      const nextRank =
        typeof data.rank === 'number' ? data.rank : await getNextRank('organizationTestimonial');

      await db.organizationTestimonial.create({
        data: toCreateData(data, nextRank),
      });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_TESTIMONIALS_TAG, ABOUT_NAV_TAG],
  });
};

export const updateOrgTestimonial = async (
  id: string,
  _prev: ActionState<OrgTestimonialFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgTestimonialFormValues>({
    schema: orgTestimonialSchema,
    formData,
    fileFields: ['avatar'],
    booleanFields: ['published'],
    numberFields: ['rank'],
    execute: async (data) => {
      await db.organizationTestimonial.update({
        where: { id },
        data: toUpdateData(data),
      });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_TESTIMONIALS_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteOrgTestimonial = async (id: string) => {
  await requireCurrentUser();

  const row = await db.organizationTestimonial.findUnique({
    where: { id },
    select: { rank: true },
  });
  if (!row) return;

  await db.organizationTestimonial.delete({ where: { id } });

  if (typeof row.rank === 'number') {
    await reorderAfterDelete('organizationTestimonial', {}, row.rank);
  }

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_TESTIMONIALS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderOrgTestimonials = async (updates: { id: string; rank: number }[]) => {
  await requireCurrentUser();

  await bulkReorder('organizationTestimonial', {}, updates);
  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_TESTIMONIALS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
