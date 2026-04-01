'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import type { ActionState } from '@/lib/types/action-state';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { type ResourceKindFormValues, resourceKindSchema } from '@/lib/schemas/resources/kinds';
import { RESOURCE_KINDS_TAG, RESOURCES_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/resources/kinds';

async function nextUniqueKindSlug(name: string) {
  const root = slugify(name);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.resourceKind.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function getNextKindSortOrder(): Promise<number> {
  const row = await db.resourceKind.findFirst({
    where: { deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeKindSortOrders() {
  const rows = await db.resourceKind.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.resourceKind.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function buildCreateData(
  data: ResourceKindFormValues,
  slug: string,
  sort_order: number,
): Prisma.ResourceKindCreateInput {
  return {
    id: slug,
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || null,
    is_active: data.is_active ?? true,
    sort_order,
  };
}

export const createResourceKind = async (
  _prev: ActionState<ResourceKindFormValues>,
  formData: FormData,
) => {
  return executeAction<ResourceKindFormValues>({
    schema: resourceKindSchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      const slug = await nextUniqueKindSlug(data.name);
      const sortOrder = await getNextKindSortOrder();

      await db.resourceKind.create({ data: buildCreateData(data, slug, sortOrder) });
      await normalizeKindSortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [RESOURCE_KINDS_TAG, RESOURCES_TAG],
  });
};

export const updateResourceKind = async (
  id: string,
  _prev: ActionState<ResourceKindFormValues>,
  formData: FormData,
) => {
  return executeAction<ResourceKindFormValues>({
    schema: resourceKindSchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      await db.resourceKind.update({
        where: { id },
        data: {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          is_active: data.is_active ?? true,
        },
      });

      await normalizeKindSortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [RESOURCE_KINDS_TAG, RESOURCES_TAG],
  });
};

export const deleteResourceKind = async (id: string) => {
  await requireCurrentUser();

  await db.resourceKind.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  await normalizeKindSortOrders();

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(RESOURCE_KINDS_TAG, 'max');
  revalidateTag(RESOURCES_TAG, 'max');
};
