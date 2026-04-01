import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { NEWSLETTERS_TAG } from '@/lib/cache/tags';

export type AdminNewsletterRow = {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  file: unknown;
  hero_image: unknown;
  published_at: Date | null;
  downloads: number;
  size_mb: number;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function listNewsletters(): Promise<AdminNewsletterRow[]> {
  return db.newsletter
    .findMany({
      where: { deleted_at: null },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
      select: {
        id: true,
        categoryId: true,
        category: { select: { name: true } },
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        file: true,
        hero_image: true,
        published_at: true,
        downloads: true,
        size_mb: true,
        is_active: true,
        sort_order: true,
        created_at: true,
        updated_at: true,
      },
    })
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        categoryName: row.category.name,
      })),
    );
}

export type AdminNewsletterById = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  file: unknown;
  hero_image: unknown;
  published_at: Date | null;
  downloads: number;
  size_mb: number;
  is_active: boolean;
  sort_order: number;
};

export async function getNewsletterById(id: string): Promise<AdminNewsletterById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(NEWSLETTERS_TAG);

  return db.newsletter.findUnique({
    where: { id },
    select: {
      id: true,
      categoryId: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      file: true,
      hero_image: true,
      published_at: true,
      downloads: true,
      size_mb: true,
      is_active: true,
      sort_order: true,
    },
  });
}
