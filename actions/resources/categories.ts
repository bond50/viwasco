'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import type { ActionState } from '@/lib/types/action-state';
import { slugify, uniqueSlug } from '@/lib/slugify';
import {
  type ResourceCategoryFormValues,
  resourceCategorySchema,
} from '@/lib/schemas/resources/categories';
import { RESOURCE_CATEGORIES_TAG, RESOURCES_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/resources/categories';

async function nextUniqueCategorySlug(kindId: string, name: string) {
  const root = slugify(name);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.resourceCategory.findUnique({
      where: { kindId_slug: { kindId, slug: candidate } },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function getNextCategorySortOrder(kindId: string): Promise<number> {
  const row = await db.resourceCategory.findFirst({
    where: { kindId, deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeCategorySortOrders(kindId: string) {
  const rows = await db.resourceCategory.findMany({
    where: { kindId, deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.resourceCategory.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function buildCreateData(
  data: ResourceCategoryFormValues,
  slug: string,
  sort_order: number,
): Prisma.ResourceCategoryCreateInput {
  return {
    id: `${data.kindId}__${slug}`,
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || null,
    is_active: data.is_active ?? true,
    sort_order,
    kind: { connect: { id: data.kindId } },
  };
}

export const createResourceCategory = async (
  _prev: ActionState<ResourceCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<ResourceCategoryFormValues>({
    schema: resourceCategorySchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      const slug = await nextUniqueCategorySlug(data.kindId, data.name);
      const sortOrder = await getNextCategorySortOrder(data.kindId);

      await db.resourceCategory.create({
        data: buildCreateData(data, slug, sortOrder),
      });

      await normalizeCategorySortOrders(data.kindId);
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [RESOURCE_CATEGORIES_TAG, RESOURCES_TAG],
  });
};

export const updateResourceCategory = async (
  id: string,
  _prev: ActionState<ResourceCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<ResourceCategoryFormValues>({
    schema: resourceCategorySchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      await db.resourceCategory.update({
        where: { id },
        data: {
          kind: { connect: { id: data.kindId } },
          name: data.name.trim(),
          description: data.description?.trim() || null,
          is_active: data.is_active ?? true,
        },
      });

      await normalizeCategorySortOrders(data.kindId);
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [RESOURCE_CATEGORIES_TAG, RESOURCES_TAG],
  });
};

export const deleteResourceCategory = async (id: string) => {
  await requireCurrentUser();

  const existing = await db.resourceCategory.findUnique({
    where: { id },
    select: { kindId: true },
  });

  await db.resourceCategory.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  if (existing?.kindId) {
    await normalizeCategorySortOrders(existing.kindId);
  }

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(RESOURCE_CATEGORIES_TAG, 'max');
  revalidateTag(RESOURCES_TAG, 'max');
};
