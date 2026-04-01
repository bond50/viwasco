'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrismaRequired } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { type CareerFormValues, careerSchema } from '@/lib/schemas/careers';
import { CAREERS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/careers';

async function nextUniqueCareerSlug(title: string) {
  const root = slugify(title);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.career.findUnique({ where: { slug: candidate }, select: { id: true } });
    return Boolean(hit);
  });
}

async function getNextCareerSortOrder(typeId: string): Promise<number> {
  const row = await db.career.findFirst({
    where: { typeId, deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeCareerSortOrders(typeId: string) {
  const rows = await db.career.findMany({
    where: { typeId, deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.career.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function buildCreateData(
  data: CareerFormValues & { slug: string },
  sortOrder: number,
): Prisma.CareerCreateInput {
  return {
    title: data.title.trim(),
    slug: data.slug,
    department: data.department.trim(),
    location: data.location.trim(),
    summary: data.summary?.trim() || null,
    file: jsonForPrismaRequired(data.file),
    closing_at: data.closing_at ?? null,
    is_active: data.is_active ?? true,
    sort_order: sortOrder,
    type: { connect: { id: data.typeId } },
  };
}

export const createCareer = async (_prev: ActionState<CareerFormValues>, formData: FormData) => {
  return executeAction<CareerFormValues>({
    schema: careerSchema,
    formData,
    booleanFields: ['is_active'],
    fileFields: ['file'],
    dateFields: ['closing_at'],
    execute: async (data) => {
      const slug = await nextUniqueCareerSlug(data.title);
      const sortOrder = await getNextCareerSortOrder(data.typeId);

      await db.career.create({
        data: buildCreateData({ ...data, slug }, sortOrder),
      });

      await normalizeCareerSortOrders(data.typeId);
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [CAREERS_TAG],
  });
};

export const updateCareer = async (
  id: string,
  _prev: ActionState<CareerFormValues>,
  formData: FormData,
) => {
  return executeAction<CareerFormValues>({
    schema: careerSchema,
    formData,
    booleanFields: ['is_active'],
    fileFields: ['file'],
    dateFields: ['closing_at'],
    execute: async (data) => {
      const existing = await db.career.findUnique({
        where: { id },
        select: { title: true, typeId: true },
      });

      const nextTitle = data.title.trim();
      const currentTitle = existing?.title?.trim() ?? '';
      const nextSlug =
        nextTitle === currentTitle ? slugify(nextTitle) : await nextUniqueCareerSlug(nextTitle);
      const previousTypeId = existing?.typeId;

      await db.career.update({
        where: { id },
        data: {
          title: nextTitle,
          slug: nextSlug,
          department: data.department.trim(),
          location: data.location.trim(),
          summary: data.summary?.trim() || null,
          file: jsonForPrismaRequired(data.file),
          closing_at: data.closing_at ?? null,
          is_active: data.is_active ?? true,
          type: { connect: { id: data.typeId } },
        },
      });

      await normalizeCareerSortOrders(data.typeId);
      if (previousTypeId && previousTypeId !== data.typeId) {
        await normalizeCareerSortOrders(previousTypeId);
      }
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [CAREERS_TAG],
  });
};

export const deleteCareer = async (id: string) => {
  await requireCurrentUser();

  const existing = await db.career.findUnique({
    where: { id },
    select: { typeId: true },
  });

  await db.career.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  if (existing?.typeId) {
    await normalizeCareerSortOrders(existing.typeId);
  }

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(CAREERS_TAG, 'max');
};
