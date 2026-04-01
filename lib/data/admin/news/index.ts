import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { NEWS_TAG } from '@/lib/cache/tags';

export type AdminNewsRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  hero_image: unknown;
  published_at: Date | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function listNews(): Promise<AdminNewsRow[]> {
  return db.news.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { published_at: 'desc' }, { created_at: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      content: true,
      hero_image: true,
      published_at: true,
      is_active: true,
      sort_order: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export type AdminNewsById = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  hero_image: unknown;
  published_at: Date | null;
  is_active: boolean;
  sort_order: number;
};

export async function getNewsById(id: string): Promise<AdminNewsById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(NEWS_TAG);

  return db.news.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      content: true,
      hero_image: true,
      published_at: true,
      is_active: true,
      sort_order: true,
    },
  });
}
