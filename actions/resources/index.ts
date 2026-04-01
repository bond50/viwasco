'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrismaRequired } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { type ResourceFormValues, resourceSchema } from '@/lib/schemas/resources';
import { RESOURCES_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/resources';

async function nextUniqueResourceSlug(title: string) {
  const root = slugify(title);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.resource.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function getNextResourceSortOrder(kindId: string): Promise<number> {
  const row = await db.resource.findFirst({
    where: { kindId, deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeResourceSortOrders(kindId: string) {
  const rows = await db.resource.findMany({
    where: { kindId, deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.resource.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function toCreateData(
  data: ResourceFormValues & { slug: string },
  nextSortOrder: number,
): Prisma.ResourceCreateInput {
  return {
    title: data.title.trim(),
    slug: data.slug,
    summary: data.summary,
    file: jsonForPrismaRequired(data.file),
    is_active: data.is_active ?? true,
    sort_order: nextSortOrder,
    kind: { connect: { id: data.kindId } },
    category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
  };
}

function toUpdateData(data: ResourceFormValues, slug: string): Prisma.ResourceUpdateInput {
  return {
    title: data.title.trim(),
    slug,
    summary: data.summary,
    file: jsonForPrismaRequired(data.file),
    is_active: data.is_active ?? true,
    kind: { connect: { id: data.kindId } },
    category: data.categoryId ? { connect: { id: data.categoryId } } : { disconnect: true },
  };
}

function revalidateResources() {
  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(RESOURCES_TAG, 'max');
}

export const createResource = async (
  _prev: ActionState<ResourceFormValues>,
  formData: FormData,
) => {
  return executeAction<ResourceFormValues>({
    schema: resourceSchema,
    formData,
    booleanFields: ['is_active'],
    fileFields: ['file'],
    execute: async (data) => {
      const ensuredSlug = await nextUniqueResourceSlug(data.title);
      const nextSortOrder = await getNextResourceSortOrder(data.kindId);

      await db.resource.create({
        data: toCreateData({ ...data, slug: ensuredSlug }, nextSortOrder),
      });

      await normalizeResourceSortOrders(data.kindId);
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [RESOURCES_TAG],
  });
};

export const updateResource = async (
  id: string,
  _prev: ActionState<ResourceFormValues>,
  formData: FormData,
) => {
  return executeAction<ResourceFormValues>({
    schema: resourceSchema,
    formData,
    booleanFields: ['is_active'],
    fileFields: ['file'],
    execute: async (data) => {
      const existing = await db.resource.findUnique({
        where: { id },
        select: { title: true, kindId: true },
      });

      const nextTitle = data.title.trim();
      const currentTitle = existing?.title?.trim() ?? '';
      const nextSlug =
        nextTitle === currentTitle ? slugify(nextTitle) : await nextUniqueResourceSlug(nextTitle);

      const previousKindId = existing?.kindId;

      await db.resource.update({
        where: { id },
        data: toUpdateData(data, nextSlug),
      });

      await normalizeResourceSortOrders(data.kindId);
      if (previousKindId && previousKindId !== data.kindId) {
        await normalizeResourceSortOrders(previousKindId);
      }
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [RESOURCES_TAG],
  });
};

export const deleteResource = async (id: string) => {
  await requireCurrentUser();

  const existing = await db.resource.findUnique({
    where: { id },
    select: { kindId: true },
  });

  await db.resource.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  if (existing?.kindId) {
    await normalizeResourceSortOrders(existing.kindId);
  }

  revalidateResources();
};
