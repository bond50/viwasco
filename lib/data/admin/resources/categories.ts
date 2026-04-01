import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { RESOURCE_CATEGORIES_TAG } from '@/lib/cache/tags';

export type AdminResourceCategoryRow = {
  id: string;
  kindId: string;
  kindName: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  _count: { resources: number };
};

export async function listResourceCategories(): Promise<AdminResourceCategoryRow[]> {
  return db.resourceCategory
    .findMany({
      where: { deleted_at: null },
      orderBy: [{ kind: { sort_order: 'asc' } }, { sort_order: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        kindId: true,
        kind: { select: { name: true } },
        name: true,
        slug: true,
        description: true,
        is_active: true,
        sort_order: true,
        created_at: true,
        updated_at: true,
        _count: { select: { resources: true } },
      },
    })
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        kindName: row.kind.name,
      })),
    );
}

export type AdminResourceCategoryById = {
  id: string;
  kindId: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

export async function getResourceCategoryById(
  id: string,
): Promise<AdminResourceCategoryById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(RESOURCE_CATEGORIES_TAG);

  return db.resourceCategory.findUnique({
    where: { id },
    select: {
      id: true,
      kindId: true,
      name: true,
      slug: true,
      description: true,
      is_active: true,
      sort_order: true,
    },
  });
}
