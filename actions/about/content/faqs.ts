// actions/about/content/faqs.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { orgFaqSchema } from '@/lib/schemas/about/content/faqs';
import type { ActionState } from '@/lib/types/action-state';
import type { OrgFaqFormValues } from '@/lib/types/about/content';

import { ABOUT_FAQS_TAG, ABOUT_NAV_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';
import { uniqueSlug } from '@/lib/slugify';
import { bulkReorder, getNextRank, reorderAfterDelete } from '@/lib/ranking';

const REVALIDATE_DASHBOARD = '/dashboard/about/faqs';

/**
 * Build a unique slug for a given question.
 * Uses uniqueSlug helper and ignores the current record when updating.
 */
async function buildFaqSlug(question: string, currentId?: string): Promise<string> {
  return uniqueSlug(question, async (candidate) => {
    const existing = await db.organizationFaq.findFirst({
      where: currentId ? { slug: candidate, NOT: { id: currentId } } : { slug: candidate },
      select: { id: true },
    });
    return Boolean(existing);
  });
}

function toCreateData(
  data: OrgFaqFormValues,
  slug: string,
  nextRank: number,
): Prisma.OrganizationFaqCreateInput {
  return {
    slug,
    question: data.question,
    answer: data.answer,
    published: typeof data.published === 'boolean' ? data.published : true,
    rank: nextRank,
  };
}

function toUpdateData(data: OrgFaqFormValues): Prisma.OrganizationFaqUpdateInput {
  const base: Prisma.OrganizationFaqUpdateInput = {
    question: data.question,
    answer: data.answer,
  };
  if (typeof data.published === 'boolean') base.published = data.published;
  if (typeof data.rank === 'number') base.rank = data.rank;
  return base;
}

export const createOrgFaq = async (_prev: ActionState<OrgFaqFormValues>, formData: FormData) => {
  return executeAction<OrgFaqFormValues>({
    schema: orgFaqSchema,
    formData,
    booleanFields: ['published'],
    numberFields: ['rank'],
    execute: async (data) => {
      const nextRank =
        typeof data.rank === 'number' ? data.rank : await getNextRank('organizationFaq');

      const slug = await buildFaqSlug(data.question);

      await db.organizationFaq.create({
        data: toCreateData(data, slug, nextRank),
      });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_FAQS_TAG, ABOUT_NAV_TAG],
  });
};

export const updateOrgFaq = async (
  id: string,
  _prev: ActionState<OrgFaqFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgFaqFormValues>({
    schema: orgFaqSchema,
    formData,
    booleanFields: ['published'],
    numberFields: ['rank'],
    execute: async (data) => {
      const slug = await buildFaqSlug(data.question, id);

      await db.organizationFaq.update({
        where: { id },
        data: {
          ...toUpdateData(data),
          slug,
        },
      });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_FAQS_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteOrgFaq = async (id: string) => {
  await requireCurrentUser();

  const row = await db.organizationFaq.findUnique({
    where: { id },
    select: { rank: true },
  });
  if (!row) return;

  await db.organizationFaq.delete({ where: { id } });
  if (typeof row.rank === 'number') {
    await reorderAfterDelete('organizationFaq', {}, row.rank);
  }

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_FAQS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderOrgFaqs = async (updates: { id: string; rank: number }[]) => {
  await requireCurrentUser();
  await bulkReorder('organizationFaq', {}, updates);
  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_FAQS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
