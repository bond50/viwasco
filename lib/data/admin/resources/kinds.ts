import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { RESOURCE_KINDS_TAG } from '@/lib/cache/tags';

export type AdminResourceKindRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  _count: { resources: number; categories: number };
};

export async function listResourceKinds(): Promise<AdminResourceKindRow[]> {
  return db.resourceKind.findMany({
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
      _count: { select: { resources: true, categories: true } },
    },
  });
}

export type AdminResourceKindById = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

export async function getResourceKindById(id: string): Promise<AdminResourceKindById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(RESOURCE_KINDS_TAG);

  return db.resourceKind.findUnique({
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
