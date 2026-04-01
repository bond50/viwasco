'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import {
  OrgDocumentCategoryFormValues,
  orgDocumentCategorySchema,
} from '@/lib/schemas/about/content/document-categories';
import type { ActionState } from '@/lib/types/action-state';

import { bulkReorder, getNextRank, reorderAfterDelete } from '@/lib/ranking';
import { ABOUT_DOC_CATS_TAG, ABOUT_DOCS_TAG, ABOUT_NAV_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';
import { uniqueSlug } from '@/lib/slugify';

const REVALIDATE_DASHBOARD = '/dashboard/about/document-categories';

async function buildCreateData(
  data: OrgDocumentCategoryFormValues,
): Promise<Prisma.DocumentCategoryCreateInput> {
  const rank = await getNextRank('documentCategory');

  const slug = await uniqueSlug(
    data.name,
    async (candidate) =>
      !!(await db.documentCategory.findFirst({
        where: { slug: candidate },
        select: { id: true },
      })),
  );

  return {
    name: data.name,
    slug,
    description: data.description ?? null,
    isActive: data.isActive ?? true,
    rank,
  };
}

function buildUpdateData(data: OrgDocumentCategoryFormValues): Prisma.DocumentCategoryUpdateInput {
  // NOTE: slug + rank are *not* editable from this form.
  // Rank is managed by RankedList reorder; slug is stable for URLs.
  return {
    name: data.name,
    description: data.description ?? null,
    isActive: data.isActive ?? true,
  };
}

export const createDocCategory = async (
  _prev: ActionState<OrgDocumentCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgDocumentCategoryFormValues>({
    schema: orgDocumentCategorySchema,
    formData,
    booleanFields: ['isActive'],
    execute: async (data) => {
      const createData = await buildCreateData(data);
      await db.documentCategory.create({ data: createData });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_DOC_CATS_TAG, ABOUT_DOCS_TAG, ABOUT_NAV_TAG],
  });
};

export const updateDocCategory = async (
  id: string,
  _prev: ActionState<OrgDocumentCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgDocumentCategoryFormValues>({
    schema: orgDocumentCategorySchema,
    formData,
    booleanFields: ['isActive'],
    execute: async (data) => {
      await db.documentCategory.update({
        where: { id },
        data: buildUpdateData(data),
      });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_DOC_CATS_TAG, ABOUT_DOCS_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteDocCategory = async (id: string) => {
  await requireCurrentUser();

  const row = await db.documentCategory.findUnique({
    where: { id },
    select: { rank: true },
  });
  if (!row) return;

  await db.documentCategory.delete({ where: { id } });

  if (typeof row.rank === 'number') {
    await reorderAfterDelete('documentCategory', {}, row.rank);
  }

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_DOC_CATS_TAG, 'max');
  revalidateTag(ABOUT_DOCS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderDocCategories = async (updates: { id: string; rank: number }[]) => {
  await requireCurrentUser();
  await bulkReorder('documentCategory', {}, updates);

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_DOC_CATS_TAG, 'max');
  revalidateTag(ABOUT_DOCS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
