import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { PROJECT_CATEGORIES_TAG } from '@/lib/cache/tags';

export type AdminProjectCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  _count: { projects: number };
};

export async function listProjectCategories(): Promise<AdminProjectCategoryRow[]> {
  return db.projectCategory.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      is_active: true,
      sort_order: true,
      created_at: true,
      updated_at: true,
      _count: { select: { projects: true } },
    },
  });
}

export type AdminProjectCategoryById = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

export async function getProjectCategoryById(id: string): Promise<AdminProjectCategoryById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(PROJECT_CATEGORIES_TAG);

  return db.projectCategory.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      is_active: true,
      sort_order: true,
    },
  });
}

export async function listActiveProjectCategories(): Promise<Array<{ id: string; label: string }>> {
  return db.projectCategory
    .findMany({
      where: { deleted_at: null, is_active: true },
      orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true },
    })
    .then((rows) => rows.map((row) => ({ id: row.id, label: row.name })));
}
