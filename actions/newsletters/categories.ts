'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import type { ActionState } from '@/lib/types/action-state';
import { slugify, uniqueSlug } from '@/lib/slugify';
import {
  type NewsletterCategoryFormValues,
  newsletterCategorySchema,
} from '@/lib/schemas/newsletters/categories';
import { NEWSLETTER_CATEGORIES_TAG, NEWSLETTERS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/newsletters/categories';

async function nextUniqueCategorySlug(name: string) {
  const root = slugify(name);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.newsletterCategory.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function getNextCategorySortOrder(): Promise<number> {
  const row = await db.newsletterCategory.findFirst({
    where: { deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeCategorySortOrders() {
  const rows = await db.newsletterCategory.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.newsletterCategory.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function buildCreateData(
  data: NewsletterCategoryFormValues,
  slug: string,
  sortOrder: number,
): Prisma.NewsletterCategoryCreateInput {
  return {
    id: slug,
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || null,
    is_active: data.is_active ?? true,
    sort_order: sortOrder,
  };
}

export const createNewsletterCategory = async (
  _prev: ActionState<NewsletterCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<NewsletterCategoryFormValues>({
    schema: newsletterCategorySchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      const slug = await nextUniqueCategorySlug(data.name);
      const sortOrder = await getNextCategorySortOrder();

      await db.newsletterCategory.create({
        data: buildCreateData(data, slug, sortOrder),
      });
      await normalizeCategorySortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [NEWSLETTER_CATEGORIES_TAG, NEWSLETTERS_TAG],
  });
};

export const updateNewsletterCategory = async (
  id: string,
  _prev: ActionState<NewsletterCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<NewsletterCategoryFormValues>({
    schema: newsletterCategorySchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      await db.newsletterCategory.update({
        where: { id },
        data: {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          is_active: data.is_active ?? true,
        },
      });

      await normalizeCategorySortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [NEWSLETTER_CATEGORIES_TAG, NEWSLETTERS_TAG],
  });
};

export const deleteNewsletterCategory = async (id: string) => {
  await requireCurrentUser();

  await db.newsletterCategory.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  await normalizeCategorySortOrders();

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(NEWSLETTER_CATEGORIES_TAG, 'max');
  revalidateTag(NEWSLETTERS_TAG, 'max');
};
