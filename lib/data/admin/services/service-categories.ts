import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import { SERVICE_CATEGORIES_TAG } from '@/lib/cache/tags';

export type AdminServiceCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  _count: {
    services: number;
  };
};

export async function listServiceCategories(): Promise<AdminServiceCategoryRow[]> {
  return db.serviceCategory.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      icon: true,
      sort_order: true,
      created_at: true,
      updated_at: true,
      _count: {
        select: {
          services: {
            where: { deleted_at: null },
          },
        },
      },
    },
  });
}

export type AdminServiceCategoryById = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
};

export async function getServiceCategoryById(id: string): Promise<AdminServiceCategoryById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(SERVICE_CATEGORIES_TAG);

  return db.serviceCategory.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      icon: true,
      sort_order: true,
    },
  });
}

export async function listServiceCategoriesForSelect(): Promise<
  Array<{ value: string; label: string }>
> {
  'use cache';
  cacheLife('minutes');
  cacheTag(SERVICE_CATEGORIES_TAG);

  const rows = await db.serviceCategory.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      sort_order: true,
    },
  });

  return rows.map((row) => ({
    value: row.id,
    label: `${row.name} (Order #${row.sort_order})`,
  }));
}
