'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrismaRequired } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { type TenderFormValues, tenderSchema } from '@/lib/schemas/tenders';
import { TENDERS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/tenders';

async function nextUniqueTenderSlug(title: string) {
  const root = slugify(title);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.tender.findUnique({ where: { slug: candidate }, select: { id: true } });
    return Boolean(hit);
  });
}

async function getNextTenderSortOrder(status: TenderFormValues['status']): Promise<number> {
  const row = await db.tender.findFirst({
    where: { status, deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeTenderSortOrders(status: TenderFormValues['status']) {
  const rows = await db.tender.findMany({
    where: { status, deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.tender.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function buildCreateData(
  data: TenderFormValues & { slug: string },
  sortOrder: number,
): Prisma.TenderCreateInput {
  return {
    title: data.title.trim(),
    slug: data.slug,
    status: data.status,
    summary: data.summary.trim(),
    file: jsonForPrismaRequired(data.file),
    published_at: data.published_at ?? null,
    closing_at: data.closing_at ?? null,
    is_active: data.is_active ?? true,
    sort_order: sortOrder,
  };
}

export const createTender = async (_prev: ActionState<TenderFormValues>, formData: FormData) => {
  return executeAction<TenderFormValues>({
    schema: tenderSchema,
    formData,
    booleanFields: ['is_active'],
    fileFields: ['file'],
    dateFields: ['published_at', 'closing_at'],
    execute: async (data) => {
      const slug = await nextUniqueTenderSlug(data.title);
      const sortOrder = await getNextTenderSortOrder(data.status);

      await db.tender.create({
        data: buildCreateData({ ...data, slug }, sortOrder),
      });

      await normalizeTenderSortOrders(data.status);
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [TENDERS_TAG],
  });
};

export const updateTender = async (
  id: string,
  _prev: ActionState<TenderFormValues>,
  formData: FormData,
) => {
  return executeAction<TenderFormValues>({
    schema: tenderSchema,
    formData,
    booleanFields: ['is_active'],
    fileFields: ['file'],
    dateFields: ['published_at', 'closing_at'],
    execute: async (data) => {
      const existing = await db.tender.findUnique({
        where: { id },
        select: { title: true, status: true },
      });

      const nextTitle = data.title.trim();
      const currentTitle = existing?.title?.trim() ?? '';
      const nextSlug =
        nextTitle === currentTitle ? slugify(nextTitle) : await nextUniqueTenderSlug(nextTitle);

      const previousStatus = existing?.status;

      await db.tender.update({
        where: { id },
        data: {
          title: nextTitle,
          slug: nextSlug,
          status: data.status,
          summary: data.summary.trim(),
          file: jsonForPrismaRequired(data.file),
          published_at: data.published_at ?? null,
          closing_at: data.closing_at ?? null,
          is_active: data.is_active ?? true,
        },
      });

      await normalizeTenderSortOrders(data.status);
      if (previousStatus && previousStatus !== data.status) {
        await normalizeTenderSortOrders(previousStatus);
      }
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [TENDERS_TAG],
  });
};

export const deleteTender = async (id: string) => {
  await requireCurrentUser();

  const existing = await db.tender.findUnique({
    where: { id },
    select: { status: true },
  });

  await db.tender.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  if (existing?.status) {
    await normalizeTenderSortOrders(existing.status);
  }

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(TENDERS_TAG, 'max');
};
