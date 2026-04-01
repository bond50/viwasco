'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { slugify, uniqueSlug } from '@/lib/slugify';
import type { ActionState } from '@/lib/types/action-state';
import {
  type ProjectCategoryFormValues,
  projectCategorySchema,
} from '@/lib/schemas/projects/categories';
import { PROJECT_CATEGORIES_TAG, PROJECTS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/projects/categories';

async function nextUniqueCategorySlug(name: string) {
  const root = slugify(name);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.projectCategory.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function getNextCategorySortOrder(): Promise<number> {
  const row = await db.projectCategory.findFirst({
    where: { deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeCategorySortOrders() {
  const rows = await db.projectCategory.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.projectCategory.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function buildCreateData(
  data: ProjectCategoryFormValues,
  slug: string,
  sortOrder: number,
): Prisma.ProjectCategoryCreateInput {
  return {
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || null,
    is_active: data.is_active ?? true,
    sort_order: sortOrder,
  };
}

export const createProjectCategory = async (
  _prev: ActionState<ProjectCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<ProjectCategoryFormValues>({
    schema: projectCategorySchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      const slug = await nextUniqueCategorySlug(data.name);
      const sortOrder = await getNextCategorySortOrder();

      await db.projectCategory.create({
        data: buildCreateData(data, slug, sortOrder),
      });

      await normalizeCategorySortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [PROJECT_CATEGORIES_TAG, PROJECTS_TAG],
  });
};

export const updateProjectCategory = async (
  id: string,
  _prev: ActionState<ProjectCategoryFormValues>,
  formData: FormData,
) => {
  return executeAction<ProjectCategoryFormValues>({
    schema: projectCategorySchema,
    formData,
    booleanFields: ['is_active'],
    execute: async (data) => {
      const existing = await db.projectCategory.findUnique({
        where: { id },
        select: { name: true },
      });

      if (!existing) {
        throw new Error('Project category not found.');
      }

      const nextName = data.name.trim();
      const currentName = existing.name.trim();
      const nextSlug =
        nextName === currentName ? slugify(nextName) : await nextUniqueCategorySlug(nextName);

      await db.projectCategory.update({
        where: { id },
        data: {
          name: nextName,
          slug: nextSlug,
          description: data.description?.trim() || null,
          is_active: data.is_active ?? true,
        },
      });

      await normalizeCategorySortOrders();
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [PROJECT_CATEGORIES_TAG, PROJECTS_TAG],
  });
};

export const deleteProjectCategory = async (id: string) => {
  await requireCurrentUser();

  const inUse = await db.project.count({
    where: {
      deleted_at: null,
      categoryId: id,
    },
  });

  if (inUse > 0) {
    throw new Error(
      'This category is in use by projects. Reassign those projects before deleting it.',
    );
  }

  await db.projectCategory.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  await normalizeCategorySortOrders();

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(PROJECT_CATEGORIES_TAG, 'max');
  revalidateTag(PROJECTS_TAG, 'max');
};
