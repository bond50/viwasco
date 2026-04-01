import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import type { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { SERVICES_TAG } from '@/lib/cache/tags';

export type AdminServiceRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: Prisma.JsonValue;
  image: Prisma.JsonValue | null;
  category_id: string | null;
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function listServices(): Promise<AdminServiceRow[]> {
  return db.service.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      image: true,
      category_id: true,
      is_active: true,
      is_public: true,
      sort_order: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export type AdminServiceById = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: Prisma.JsonValue;
  image: Prisma.JsonValue | null;
  category_id: string | null;
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
};

export async function getServiceById(id: string): Promise<AdminServiceById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(SERVICES_TAG);

  return db.service.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      image: true,
      category_id: true,
      is_active: true,
      is_public: true,
      sort_order: true,
    },
  });
}
