'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import type { ActionState } from '@/lib/types/action-state';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { type CareerTypeFormValues, careerTypeSchema } from '@/lib/schemas/careers/types';
import { CAREER_TYPES_TAG, CAREERS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/careers/types';

async function nextUniqueTypeSlug(name: string) {
  const root = slugify(name);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.careerType.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function getNextTypeSortOrder(): Promise<number> {
  const row = await db.careerType.findFirst({
    where: { deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeTypeSortOrders() {
  const rows = await db.careerType.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.careerType.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function buildCreateData(
  data: CareerTypeFormValues,
  slug: string,
  sortOrder: number,
): Prisma.CareerTypeCreateInput {
  return {
    id: slug,
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || null,
    is_active: data.is_active ?? true,
    sort_order: sortOrder,
  };
}

export const createCareerType = async (
  _prev: ActionState<CareerTypeFormValues>,
  formData: FormData,
) => {
  return executeAction<CareerTypeFormValues>({
    schema: careerTypeSchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      const slug = await nextUniqueTypeSlug(data.name);
      const sortOrder = await getNextTypeSortOrder();

      await db.careerType.create({ data: buildCreateData(data, slug, sortOrder) });
      await normalizeTypeSortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [CAREER_TYPES_TAG, CAREERS_TAG],
  });
};

export const updateCareerType = async (
  id: string,
  _prev: ActionState<CareerTypeFormValues>,
  formData: FormData,
) => {
  return executeAction<CareerTypeFormValues>({
    schema: careerTypeSchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      await db.careerType.update({
        where: { id },
        data: {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          is_active: data.is_active ?? true,
        },
      });

      await normalizeTypeSortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [CAREER_TYPES_TAG, CAREERS_TAG],
  });
};

export const deleteCareerType = async (id: string) => {
  await requireCurrentUser();

  await db.careerType.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  await normalizeTypeSortOrders();

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(CAREER_TYPES_TAG, 'max');
  revalidateTag(CAREERS_TAG, 'max');
};
