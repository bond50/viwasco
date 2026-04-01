'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { type NewsFormValues, newsSchema } from '@/lib/schemas/news';
import { NEWS_CATEGORIES_TAG, NEWS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/news';

async function nextUniqueNewsSlug(title: string) {
  const root = slugify(title);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.news.findUnique({ where: { slug: candidate }, select: { id: true } });
    return Boolean(hit);
  });
}

async function getNextNewsSortOrder(): Promise<number> {
  const row = await db.news.findFirst({
    where: { deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeNewsSortOrders() {
  const rows = await db.news.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.news.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

async function assertNewsCategoryExists(category: string) {
  const hit = await db.newsCategory.findFirst({
    where: {
      deleted_at: null,
      is_active: true,
      name: category.trim(),
    },
    select: { id: true },
  });

  if (!hit) {
    throw new Error('Select a valid news category from the managed category list.');
  }
}

function buildCreateData(
  data: NewsFormValues & { slug: string },
  sortOrder: number,
): Prisma.NewsCreateInput {
  return {
    title: data.title.trim(),
    slug: data.slug,
    category: data.category.trim(),
    excerpt: data.excerpt.trim(),
    content: data.content.trim(),
    hero_image: jsonForPrisma(data.hero_image ?? undefined),
    published_at: data.published_at ?? null,
    is_active: data.is_active ?? true,
    sort_order: sortOrder,
  };
}

export const createNews = async (_prev: ActionState<NewsFormValues>, formData: FormData) => {
  return executeAction<NewsFormValues>({
    schema: newsSchema,
    formData,
    booleanFields: ['is_active'],
    fileFields: ['hero_image'],
    dateFields: ['published_at'],
    execute: async (data) => {
      await assertNewsCategoryExists(data.category);
      const slug = await nextUniqueNewsSlug(data.title);
      const sortOrder = await getNextNewsSortOrder();

      await db.news.create({
        data: buildCreateData({ ...data, slug }, sortOrder),
      });

      await normalizeNewsSortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [NEWS_TAG, NEWS_CATEGORIES_TAG],
  });
};

export const updateNews = async (
  id: string,
  _prev: ActionState<NewsFormValues>,
  formData: FormData,
) => {
  return executeAction<NewsFormValues>({
    schema: newsSchema,
    formData,
    booleanFields: ['is_active'],
    fileFields: ['hero_image'],
    dateFields: ['published_at'],
    execute: async (data) => {
      await assertNewsCategoryExists(data.category);
      const existing = await db.news.findUnique({
        where: { id },
        select: { title: true },
      });

      const nextTitle = data.title.trim();
      const currentTitle = existing?.title?.trim() ?? '';
      const nextSlug =
        nextTitle === currentTitle ? slugify(nextTitle) : await nextUniqueNewsSlug(nextTitle);

      await db.news.update({
        where: { id },
        data: {
          title: nextTitle,
          slug: nextSlug,
          category: data.category.trim(),
          excerpt: data.excerpt.trim(),
          content: data.content.trim(),
          hero_image: jsonForPrisma(data.hero_image ?? undefined),
          published_at: data.published_at ?? null,
          is_active: data.is_active ?? true,
        },
      });

      await normalizeNewsSortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [NEWS_TAG, NEWS_CATEGORIES_TAG],
  });
};

export const deleteNews = async (id: string) => {
  await requireCurrentUser();

  await db.news.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  await normalizeNewsSortOrders();

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(NEWS_TAG, 'max');
  revalidateTag(NEWS_CATEGORIES_TAG, 'max');
};
