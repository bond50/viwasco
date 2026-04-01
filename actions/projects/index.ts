'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import { slugify, uniqueSlug } from '@/lib/slugify';
import type { ActionState } from '@/lib/types/action-state';
import { type ProjectFormValues, projectSchema } from '@/lib/schemas/projects';
import { PROJECT_CATEGORIES_TAG, PROJECTS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_ADMIN = '/dashboard/projects';
const REVALIDATE_PUBLIC = '/projects';

async function nextUniqueProjectSlug(title: string) {
  const root = slugify(title);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.project.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(hit);
  });
}

async function assertProjectCategoryExists(categoryId: string) {
  const row = await db.projectCategory.findFirst({
    where: { id: categoryId, deleted_at: null, is_active: true },
    select: { id: true },
  });

  if (!row) {
    throw new Error('Select a valid active project category.');
  }
}

async function getNextProjectSortOrder(): Promise<number> {
  const row = await db.project.findFirst({
    where: { deleted_at: null },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  return row ? row.sort_order + 1 : 1;
}

async function normalizeProjectSortOrders() {
  const rows = await db.project.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    select: { id: true },
  });

  await db.$transaction(
    rows.map((row, index) =>
      db.project.update({
        where: { id: row.id },
        data: { sort_order: index + 1 },
      }),
    ),
  );
}

function toCreateData(
  data: ProjectFormValues & { slug: string },
  nextSortOrder: number,
): Prisma.ProjectCreateInput {
  return {
    title: data.title,
    slug: data.slug,
    category: { connect: { id: data.categoryId } },
    status: data.status,
    short_description: data.short_description,
    content: data.content,
    hero_image:
      typeof data.hero_image !== 'undefined'
        ? jsonForPrisma(data.hero_image ?? null)
        : Prisma.JsonNull,
    sort_order: nextSortOrder,
  };
}

function toUpdateData(data: ProjectFormValues, slug: string): Prisma.ProjectUpdateInput {
  const patch: Prisma.ProjectUpdateInput = {
    title: data.title,
    slug,
    category: { connect: { id: data.categoryId } },
    status: data.status,
    short_description: data.short_description,
    content: data.content,
  };

  if (typeof data.hero_image !== 'undefined') {
    patch.hero_image = jsonForPrisma(data.hero_image ?? null);
  }

  return patch;
}

export const createProject = async (_prev: ActionState<ProjectFormValues>, formData: FormData) => {
  return executeAction<ProjectFormValues>({
    schema: projectSchema,
    formData,
    fileFields: ['hero_image'],
    execute: async (data) => {
      await assertProjectCategoryExists(data.categoryId);

      const ensuredSlug = await nextUniqueProjectSlug(data.title);
      const nextSortOrder = await getNextProjectSortOrder();

      await db.project.create({
        data: toCreateData({ ...data, slug: ensuredSlug }, nextSortOrder),
      });

      await normalizeProjectSortOrders();
    },
    revalidate: REVALIDATE_ADMIN,
    revalidateTags: [PROJECTS_TAG, PROJECT_CATEGORIES_TAG],
  });
};

export const updateProject = async (
  id: string,
  _prev: ActionState<ProjectFormValues>,
  formData: FormData,
) => {
  return executeAction<ProjectFormValues>({
    schema: projectSchema,
    formData,
    fileFields: ['hero_image'],
    execute: async (data) => {
      await assertProjectCategoryExists(data.categoryId);

      const existing = await db.project.findUnique({
        where: { id },
        select: { title: true },
      });

      const nextTitle = data.title.trim();
      const currentTitle = existing?.title?.trim() ?? '';
      const nextSlug =
        nextTitle === currentTitle ? slugify(nextTitle) : await nextUniqueProjectSlug(nextTitle);

      await db.project.update({
        where: { id },
        data: toUpdateData(data, nextSlug),
      });

      await normalizeProjectSortOrders();
    },
    revalidate: REVALIDATE_ADMIN,
    revalidateTags: [PROJECTS_TAG, PROJECT_CATEGORIES_TAG],
  });
};

export const deleteProject = async (id: string) => {
  await requireCurrentUser();

  await db.project.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  await normalizeProjectSortOrders();

  revalidatePath(REVALIDATE_ADMIN);
  revalidatePath(REVALIDATE_PUBLIC);
  revalidateTag(PROJECTS_TAG, 'max');
};
