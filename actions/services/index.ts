'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import { slugify, uniqueSlug } from '@/lib/slugify';
import type { ActionState } from '@/lib/types/action-state';
import { type ServiceFormValues, serviceSchema } from '@/lib/schemas/services';
import { ABOUT_NAV_TAG, SERVICE_CATEGORIES_TAG, SERVICES_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/services';

type ServiceContentJson = {
  html: string;
};

function toContentJson(html: string): Prisma.InputJsonValue {
  const payload: ServiceContentJson = { html };
  return payload satisfies Prisma.InputJsonValue;
}

async function nextUniqueServiceSlug(title: string) {
  const root = slugify(title);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.service.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function getNextServiceSortOrder(): Promise<number> {
  const row = await db.service.findFirst({
    where: { deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeServiceSortOrders() {
  const rows = await db.service.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.service.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function toCreateData(
  data: ServiceFormValues & { slug: string },
  nextSortOrder: number,
): Prisma.ServiceCreateInput {
  return {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt?.trim() || null,
    content: toContentJson(data.content),
    image: typeof data.image !== 'undefined' ? jsonForPrisma(data.image ?? null) : Prisma.JsonNull,
    is_active: typeof data.is_active === 'boolean' ? data.is_active : true,
    is_public: typeof data.is_public === 'boolean' ? data.is_public : true,
    sort_order: nextSortOrder,
  };
}

function toUpdateData(data: ServiceFormValues, slug: string): Prisma.ServiceUpdateInput {
  const patch: Prisma.ServiceUpdateInput = {
    title: data.title,
    slug,
    excerpt: data.excerpt?.trim() || null,
    content: toContentJson(data.content),
  };

  if (typeof data.image !== 'undefined') {
    patch.image = jsonForPrisma(data.image ?? null);
  }

  if (typeof data.is_active === 'boolean') {
    patch.is_active = data.is_active;
  }

  if (typeof data.is_public === 'boolean') {
    patch.is_public = data.is_public;
  }

  return patch;
}

export const createService = async (_prev: ActionState<ServiceFormValues>, formData: FormData) => {
  return executeAction<ServiceFormValues>({
    schema: serviceSchema,
    formData,
    fileFields: ['image'],
    booleanFields: ['is_active', 'is_public'],
    execute: async (data) => {
      const ensuredSlug = await nextUniqueServiceSlug(data.title);
      const nextSortOrder = await getNextServiceSortOrder();

      await db.service.create({
        data: toCreateData({ ...data, slug: ensuredSlug }, nextSortOrder),
      });

      await normalizeServiceSortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [SERVICES_TAG, SERVICE_CATEGORIES_TAG, ABOUT_NAV_TAG],
  });
};

export const updateService = async (
  id: string,
  _prev: ActionState<ServiceFormValues>,
  formData: FormData,
) => {
  return executeAction<ServiceFormValues>({
    schema: serviceSchema,
    formData,
    fileFields: ['image'],
    booleanFields: ['is_active', 'is_public'],
    execute: async (data) => {
      const existing = await db.service.findUnique({
        where: { id },
        select: { title: true },
      });

      const nextTitle = data.title.trim();
      const currentTitle = existing?.title?.trim() ?? '';
      const nextSlug =
        nextTitle === currentTitle ? slugify(nextTitle) : await nextUniqueServiceSlug(nextTitle);

      await db.service.update({
        where: { id },
        data: toUpdateData(data, nextSlug),
      });

      await normalizeServiceSortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [SERVICES_TAG, SERVICE_CATEGORIES_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteService = async (id: string) => {
  await requireCurrentUser();

  await db.service.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  await normalizeServiceSortOrders();

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(SERVICES_TAG, 'max');
  revalidateTag(SERVICE_CATEGORIES_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderServices = async (updates: Array<{ id: string; sort_order: number }>) => {
  await requireCurrentUser();

  await db.$transaction(
    updates.map((item) =>
      db.service.update({
        where: { id: item.id },
        data: { sort_order: item.sort_order },
      }),
    ),
  );

  await normalizeServiceSortOrders();

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(SERVICES_TAG, 'max');
  revalidateTag(SERVICE_CATEGORIES_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
