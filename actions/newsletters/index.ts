'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma, jsonForPrismaRequired } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { type NewsletterFormValues, newsletterSchema } from '@/lib/schemas/newsletters';
import { NEWSLETTERS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/newsletters';

async function nextUniqueNewsletterSlug(title: string) {
  const root = slugify(title);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.newsletter.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function getNextNewsletterSortOrder(categoryId: string): Promise<number> {
  const row = await db.newsletter.findFirst({
    where: { categoryId, deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeNewsletterSortOrders(categoryId: string) {
  const rows = await db.newsletter.findMany({
    where: { categoryId, deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.newsletter.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function buildCreateData(
  data: NewsletterFormValues & { slug: string },
  sortOrder: number,
): Prisma.NewsletterCreateInput {
  return {
    title: data.title.trim(),
    slug: data.slug,
    category: { connect: { id: data.categoryId } },
    excerpt: data.excerpt.trim(),
    content: data.content.trim(),
    file: jsonForPrismaRequired(data.file),
    hero_image: jsonForPrisma(data.hero_image ?? undefined),
    published_at: data.published_at ?? null,
    downloads: data.downloads ?? 0,
    size_mb: data.size_mb ?? 0,
    is_active: data.is_active ?? true,
    sort_order: sortOrder,
  };
}

export const createNewsletter = async (
  _prev: ActionState<NewsletterFormValues>,
  formData: FormData,
) => {
  return executeAction<NewsletterFormValues>({
    schema: newsletterSchema,
    formData,
    booleanFields: ['is_active'],
    fileFields: ['file', 'hero_image'],
    dateFields: ['published_at'],
    numberFields: ['downloads', 'size_mb'],
    execute: async (data) => {
      const slug = await nextUniqueNewsletterSlug(data.title);
      const sortOrder = await getNextNewsletterSortOrder(data.categoryId);

      await db.newsletter.create({
        data: buildCreateData({ ...data, slug }, sortOrder),
      });

      await normalizeNewsletterSortOrders(data.categoryId);
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [NEWSLETTERS_TAG],
  });
};

export const updateNewsletter = async (
  id: string,
  _prev: ActionState<NewsletterFormValues>,
  formData: FormData,
) => {
  return executeAction<NewsletterFormValues>({
    schema: newsletterSchema,
    formData,
    booleanFields: ['is_active'],
    fileFields: ['file', 'hero_image'],
    dateFields: ['published_at'],
    numberFields: ['downloads', 'size_mb'],
    execute: async (data) => {
      const existing = await db.newsletter.findUnique({
        where: { id },
        select: { title: true, categoryId: true },
      });

      const nextTitle = data.title.trim();
      const currentTitle = existing?.title?.trim() ?? '';
      const nextSlug =
        nextTitle === currentTitle ? slugify(nextTitle) : await nextUniqueNewsletterSlug(nextTitle);
      const previousCategoryId = existing?.categoryId;

      await db.newsletter.update({
        where: { id },
        data: {
          title: nextTitle,
          slug: nextSlug,
          category: { connect: { id: data.categoryId } },
          excerpt: data.excerpt.trim(),
          content: data.content.trim(),
          file: jsonForPrismaRequired(data.file),
          hero_image: jsonForPrisma(data.hero_image ?? undefined),
          published_at: data.published_at ?? null,
          downloads: data.downloads ?? 0,
          size_mb: data.size_mb ?? 0,
          is_active: data.is_active ?? true,
        },
      });

      await normalizeNewsletterSortOrders(data.categoryId);
      if (previousCategoryId && previousCategoryId !== data.categoryId) {
        await normalizeNewsletterSortOrders(previousCategoryId);
      }
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [NEWSLETTERS_TAG],
  });
};

export const deleteNewsletter = async (id: string) => {
  await requireCurrentUser();

  const existing = await db.newsletter.findUnique({
    where: { id },
    select: { categoryId: true },
  });

  await db.newsletter.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  if (existing?.categoryId) {
    await normalizeNewsletterSortOrders(existing.categoryId);
  }

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(NEWSLETTERS_TAG, 'max');
};
