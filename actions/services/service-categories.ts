'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { slugify, uniqueSlug } from '@/lib/slugify';
import type { ActionState } from '@/lib/types/action-state';
import {
  type ServiceCategoryFormValues,
  serviceCategorySchema,
} from '@/lib/schemas/services/service-categories';
import { ABOUT_NAV_TAG, SERVICE_CATEGORIES_TAG, SERVICES_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/services/service-categories';

async function nextUniqueCategorySlug(name: string) {
  const root = slugify(name);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.serviceCategory.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function getNextCategorySortOrder(): Promise<number> {
  const row = await db.serviceCategory.findFirst({
    where: { deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeCategorySortOrders() {
  const rows = await db.serviceCategory.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.serviceCategory.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

export const createServiceCategory = async (
  _prev: ActionState<ServiceCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<ServiceCategoryFormValues>({
    schema: serviceCategorySchema,
    formData,
    numberFields: ['sort_order'],
    execute: async (data) => {
      const ensuredSlug = await nextUniqueCategorySlug(data.name);
      const nextSortOrder = await getNextCategorySortOrder();

      await db.serviceCategory.create({
        data: {
          name: data.name,
          slug: ensuredSlug,
          description: data.description?.trim() || null,
          icon: data.icon?.trim() || null,
          sort_order: nextSortOrder,
        },
      });

      await normalizeCategorySortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [SERVICE_CATEGORIES_TAG, SERVICES_TAG, ABOUT_NAV_TAG],
  });
};

export const updateServiceCategory = async (
  id: string,
  _prev: ActionState<ServiceCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<ServiceCategoryFormValues>({
    schema: serviceCategorySchema,
    formData,
    numberFields: ['sort_order'],
    execute: async (data) => {
      const existing = await db.serviceCategory.findUnique({
        where: { id },
        select: { name: true },
      });

      const nextName = data.name.trim();
      const currentName = existing?.name?.trim() ?? '';
      const nextSlug =
        nextName === currentName ? slugify(nextName) : await nextUniqueCategorySlug(nextName);

      await db.serviceCategory.update({
        where: { id },
        data: {
          name: nextName,
          slug: nextSlug,
          description: data.description?.trim() || null,
          icon: data.icon?.trim() || null,
        },
      });

      await normalizeCategorySortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [SERVICE_CATEGORIES_TAG, SERVICES_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteServiceCategory = async (id: string) => {
  await requireCurrentUser();

  await db.serviceCategory.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  await normalizeCategorySortOrders();

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(SERVICE_CATEGORIES_TAG, 'max');
  revalidateTag(SERVICES_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderServiceCategories = async (
  updates: Array<{ id: string; sort_order: number }>,
) => {
  await requireCurrentUser();

  await db.$transaction(
    updates.map((item) =>
      db.serviceCategory.update({
        where: { id: item.id },
        data: { sort_order: item.sort_order },
      }),
    ),
  );

  await normalizeCategorySortOrders();

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(SERVICE_CATEGORIES_TAG, 'max');
  revalidateTag(SERVICES_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
