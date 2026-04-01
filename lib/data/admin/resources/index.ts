import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { RESOURCES_TAG } from '@/lib/cache/tags';

export type AdminResourceRow = {
  id: string;
  title: string;
  slug: string;
  kindId: string;
  kindName: string;
  categoryId: string | null;
  categoryName: string | null;
  summary: string;
  file: unknown;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function listResources(): Promise<AdminResourceRow[]> {
  return db.resource
    .findMany({
      where: { deleted_at: null },
      orderBy: [{ kind: { sort_order: 'asc' } }, { sort_order: 'asc' }, { created_at: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        kindId: true,
        kind: { select: { name: true } },
        categoryId: true,
        category: { select: { name: true } },
        summary: true,
        file: true,
        is_active: true,
        sort_order: true,
        created_at: true,
        updated_at: true,
      },
    })
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        kindName: row.kind.name,
        categoryName: row.category?.name ?? null,
      })),
    );
}

export type AdminResourceById = {
  id: string;
  title: string;
  slug: string;
  kindId: string;
  categoryId: string | null;
  summary: string;
  file: unknown;
  is_active: boolean;
  sort_order: number;
};

export async function getResourceById(id: string): Promise<AdminResourceById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(RESOURCES_TAG);

  return db.resource.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      kindId: true,
      categoryId: true,
      summary: true,
      file: true,
      is_active: true,
      sort_order: true,
    },
  });
}
