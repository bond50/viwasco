import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { getBestImageUrl } from '@/lib/assets/core';
import { db } from '@/lib/db';
import { NEWS_TAG } from '@/lib/cache/tags';
import { slugify } from '@/lib/slugify';

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  heroImage: string;
};

export type NewsCategory = {
  slug: string;
  label: string;
  count: number;
};

type NewsRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published_at: Date | null;
  updated_at: Date;
  hero_image: unknown;
};

function toVm(row: NewsRow): NewsItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    publishedAt: row.published_at?.toISOString() ?? '',
    updatedAt: row.updated_at.toISOString(),
    heroImage:
      getBestImageUrl(row.hero_image as never, [
        'hero',
        'cover',
        'wide',
        'banner',
        'xl',
        'large',
        'medium',
        'original',
      ]) ?? '/assets/img/featured-default.jpg',
  };
}

const publicNewsWhere = {
  deleted_at: null,
  is_active: true,
  published_at: { not: null },
} as const;

export async function getNewsCategories(): Promise<NewsCategory[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(NEWS_TAG);

  const rows = await db.news.findMany({
    where: publicNewsWhere,
    select: { category: true },
    orderBy: [{ category: 'asc' }],
  });

  const map = new Map<string, NewsCategory>();
  for (const row of rows) {
    const label = row.category.trim();
    const slug = slugify(label);
    const existing = map.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(slug, { slug, label, count: 1 });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export async function getNewsItems(categorySlug?: string): Promise<NewsItem[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(NEWS_TAG);

  const rows = await db.news.findMany({
    where: publicNewsWhere,
    orderBy: [{ sort_order: 'asc' }, { published_at: 'desc' }, { created_at: 'desc' }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      excerpt: true,
      content: true,
      published_at: true,
      updated_at: true,
      hero_image: true,
    },
  });

  const items = rows.map((row) => toVm(row as NewsRow));
  if (!categorySlug) return items;
  return items.filter((item) => slugify(item.category) === categorySlug);
}

export async function getLatestNews(limit = 4): Promise<NewsItem[]> {
  const items = await getNewsItems();
  return items.slice(0, limit);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag(NEWS_TAG);

  const row = await db.news.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      excerpt: true,
      content: true,
      published_at: true,
      updated_at: true,
      hero_image: true,
      is_active: true,
      deleted_at: true,
    },
  });

  if (!row || !row.is_active || row.deleted_at || !row.published_at) return null;
  return toVm(row as NewsRow);
}
