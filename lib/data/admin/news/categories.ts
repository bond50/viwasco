import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { NEWS_CATEGORIES_TAG } from '@/lib/cache/tags';

export type NewsCategoryOption = {
  id: string;
  label: string;
};

export type AdminNewsCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function listNewsCategories(): Promise<AdminNewsCategoryRow[]> {
  return db.newsCategory.findMany({
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
    },
  });
}

export async function listActiveNewsCategories(): Promise<NewsCategoryOption[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(NEWS_CATEGORIES_TAG);

  const rows = await db.newsCategory.findMany({
    where: { deleted_at: null, is_active: true },
    orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true },
  });

  return rows.map((row) => ({ id: row.id, label: row.name }));
}

export async function getNewsCategoryById(id: string): Promise<AdminNewsCategoryRow | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(NEWS_CATEGORIES_TAG);

  return db.newsCategory.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      is_active: true,
      sort_order: true,
      created_at: true,
      updated_at: true,
    },
  });
}
