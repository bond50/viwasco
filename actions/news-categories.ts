'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { slugify, uniqueSlug } from '@/lib/slugify';
import type { ActionState } from '@/lib/types/action-state';
import { type NewsCategoryFormValues, newsCategorySchema } from '@/lib/schemas/news/categories';
import { NEWS_CATEGORIES_TAG, NEWS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/news/categories';

async function nextUniqueCategorySlug(name: string) {
  const root = slugify(name);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.newsCategory.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function getNextCategorySortOrder(): Promise<number> {
  const row = await db.newsCategory.findFirst({
    where: { deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeCategorySortOrders() {
  const rows = await db.newsCategory.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.newsCategory.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function buildCreateData(
  data: NewsCategoryFormValues,
  slug: string,
  sortOrder: number,
): Prisma.NewsCategoryCreateInput {
  return {
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || null,
    is_active: data.is_active ?? true,
    sort_order: sortOrder,
  };
}

export const createNewsCategory = async (
  _prev: ActionState<NewsCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<NewsCategoryFormValues>({
    schema: newsCategorySchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      const slug = await nextUniqueCategorySlug(data.name);
      const sortOrder = await getNextCategorySortOrder();

      await db.newsCategory.create({
        data: buildCreateData(data, slug, sortOrder),
      });

      await normalizeCategorySortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [NEWS_CATEGORIES_TAG, NEWS_TAG],
  });
};

export const updateNewsCategory = async (
  id: string,
  _prev: ActionState<NewsCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<NewsCategoryFormValues>({
    schema: newsCategorySchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      const existing = await db.newsCategory.findUnique({
        where: { id },
        select: { name: true },
      });

      if (!existing) {
        throw new Error('News category not found.');
      }

      const nextName = data.name.trim();
      const currentName = existing.name.trim();
      const nextSlug =
        nextName === currentName ? slugify(nextName) : await nextUniqueCategorySlug(nextName);

      await db.$transaction(async (tx) => {
        await tx.newsCategory.update({
          where: { id },
          data: {
            name: nextName,
            slug: nextSlug,
            description: data.description?.trim() || null,
            is_active: data.is_active ?? true,
          },
        });

        if (nextName !== currentName) {
          await tx.news.updateMany({
            where: { category: currentName, deleted_at: null },
            data: { category: nextName },
          });
        }
      });

      await normalizeCategorySortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [NEWS_CATEGORIES_TAG, NEWS_TAG],
  });
};

export const deleteNewsCategory = async (id: string) => {
  await requireCurrentUser();

  const row = await db.newsCategory.findUnique({
    where: { id },
    select: { name: true },
  });

  if (!row) return;

  const inUse = await db.news.count({
    where: {
      deleted_at: null,
      category: row.name,
    },
  });

  if (inUse > 0) {
    throw new Error(
      'This category is in use by news items. Reassign those items before deleting it.',
    );
  }

  await db.newsCategory.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  await normalizeCategorySortOrders();

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(NEWS_CATEGORIES_TAG, 'max');
  revalidateTag(NEWS_TAG, 'max');
};
