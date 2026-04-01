// actions/about/content/leadership/categories.ts
'use server';

import { LeadershipCategoryType, Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import type { ActionState } from '@/lib/types/action-state';
import { bulkReorder, getNextRank, reorderAfterDelete } from '@/lib/ranking';
import { managementCategorySchema } from '@/lib/schemas/about/content/leadership';
import { uniqueSlug } from '@/lib/slugify';
import {
  ABOUT_LEADERSHIP_CATS_TAG,
  ABOUT_LEADERSHIP_TEAM_TAG,
  ABOUT_NAV_TAG,
} from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_PATH = '/dashboard/about/leadership/categories';

/** Runtime guard to convert UI string → Prisma enum safely (no `any`) */
function toPrismaCategoryType(input: unknown): LeadershipCategoryType {
  if (
    typeof input === 'string' &&
    (Object.values(LeadershipCategoryType) as string[]).includes(input)
  ) {
    return input as LeadershipCategoryType;
  }
  throw new Error('Invalid category type');
}

function toCreateData(data: {
  name: string;
  description?: string | null;
  rank: number;
  slug: string;
  categoryType: LeadershipCategoryType;
}): Prisma.ManagementCategoryCreateInput {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description ?? null,
    rank: data.rank,
    categoryType: data.categoryType,
  };
}

function toUpdateData(data: {
  name: string;
  description?: string | null;
  rank?: number;
  categoryType: LeadershipCategoryType;
}): Prisma.ManagementCategoryUpdateInput {
  return {
    name: data.name,
    description: data.description ?? null,
    categoryType: data.categoryType,
    ...(typeof data.rank === 'number' ? { rank: data.rank } : {}),
  };
}

export const createCategory = async (_prev: ActionState<unknown>, formData: FormData) => {
  return executeAction({
    schema: managementCategorySchema,
    formData,
    numberFields: ['rank'],
    execute: async (data) => {
      const rank =
        typeof data.rank === 'number' ? data.rank : await getNextRank('managementCategory');

      const slug = await uniqueSlug(data.name, async (s) => {
        const hit = await db.managementCategory.findUnique({
          where: { slug: s },
          select: { id: true },
        });
        return !!hit;
      });

      await db.managementCategory.create({
        data: toCreateData({
          name: data.name,
          description: data.description ?? null,
          rank,
          slug,
          categoryType: toPrismaCategoryType(data.categoryType),
        }),
      });
    },
    revalidate: REVALIDATE_PATH,
    revalidateTags: [ABOUT_LEADERSHIP_CATS_TAG, ABOUT_NAV_TAG],
  });
};

export const updateCategory = async (
  id: string,
  _prev: ActionState<unknown>,
  formData: FormData,
) => {
  return executeAction({
    schema: managementCategorySchema,
    formData,
    numberFields: ['rank'],
    execute: async (data) => {
      await db.managementCategory.update({
        where: { id },
        data: toUpdateData({
          name: data.name,
          description: data.description ?? null,
          rank: typeof data.rank === 'number' ? data.rank : undefined,
          categoryType: toPrismaCategoryType(data.categoryType),
        }),
      });
    },
    revalidate: REVALIDATE_PATH,
    revalidateTags: [ABOUT_LEADERSHIP_CATS_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteCategory = async (id: string) => {
  await requireCurrentUser();

  const row = await db.managementCategory.findUnique({
    where: { id },
    select: { rank: true },
  });
  if (!row) return;

  await db.managementCategory.delete({ where: { id } });

  if (typeof row.rank === 'number') {
    await reorderAfterDelete('managementCategory', {}, row.rank);
  }
  revalidatePath(REVALIDATE_PATH);
  revalidateTag(ABOUT_LEADERSHIP_CATS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
  revalidateTag(ABOUT_LEADERSHIP_TEAM_TAG, 'max');
};

export const reorderCategories = async (updates: { id: string; rank: number }[]) => {
  await requireCurrentUser();

  await bulkReorder('managementCategory', {}, updates);
  revalidatePath(REVALIDATE_PATH);
  revalidateTag(ABOUT_LEADERSHIP_CATS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
