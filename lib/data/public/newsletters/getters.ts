import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { assetUrl, ensureUploadedImage, getBestImageUrl } from '@/lib/assets/core';
import { db } from '@/lib/db';
import { NEWSLETTER_CATEGORIES_TAG, NEWSLETTERS_TAG } from '@/lib/cache/tags';

export type NewsletterCategory = { id: string; slug: string; label: string };
export type NewsletterItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  publishedAt: string;
  downloads: number;
  sizeMb: number;
  pdfUrl: string;
  heroImage: string;
};

type NewsletterCategoryRow = Awaited<ReturnType<typeof db.newsletterCategory.findMany>>[number];
type NewsletterRow = Awaited<ReturnType<typeof db.newsletter.findMany>>[number];

function getNewsletterHeroImage(heroImage: NewsletterRow['hero_image']): string {
  return (
    getBestImageUrl(ensureUploadedImage(heroImage), ['small', 'medium', 'large', 'original']) ??
    '/assets/img/featured-default.jpg'
  );
}

export async function getNewsletterCategories(): Promise<NewsletterCategory[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(NEWSLETTER_CATEGORIES_TAG);
  const rows = await db.newsletterCategory.findMany({
    where: { deleted_at: null, is_active: true },
    orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
    select: { id: true, slug: true, name: true },
  });
  return (rows as NewsletterCategoryRow[]).map((row: NewsletterCategoryRow) => ({ id: row.id, slug: row.slug, label: row.name }));
}

export async function getNewsletterBySlug(slug: string): Promise<NewsletterItem | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag(NEWSLETTERS_TAG);
  const row = await db.newsletter.findUnique({
    where: { slug },
    select: { id: true, slug: true, title: true, excerpt: true, content: true, categoryId: true, published_at: true, downloads: true, size_mb: true, file: true, hero_image: true },
  });
  if (!row) return null;
  const pdfUrl = assetUrl(row.file as Parameters<typeof assetUrl>[0]);
  const heroImage = getNewsletterHeroImage(row.hero_image);
  return { id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt, content: row.content, categoryId: row.categoryId, publishedAt: row.published_at?.toISOString() ?? '', downloads: row.downloads, sizeMb: row.size_mb, pdfUrl: pdfUrl ?? '', heroImage };
}

export async function getPaginatedNewsletters(
  categorySlug: string | undefined,
  page: number,
  pageSize: number,
): Promise<{ items: NewsletterItem[]; total: number; totalPages: number; page: number; categories: NewsletterCategory[] }> {
  'use cache';
  cacheLife('weeks');
  cacheTag(NEWSLETTERS_TAG);
  const categories = await getNewsletterCategories();
  const categoryRow = categorySlug ? await db.newsletterCategory.findUnique({ where: { slug: categorySlug }, select: { id: true } }) : null;
  const rows = await db.newsletter.findMany({
    where: { deleted_at: null, is_active: true, ...(categoryRow ? { categoryId: categoryRow.id } : {}) },
    orderBy: [{ sort_order: 'asc' }, { published_at: 'desc' }],
    select: { id: true, slug: true, title: true, excerpt: true, content: true, categoryId: true, published_at: true, downloads: true, size_mb: true, file: true, hero_image: true },
  });
  const items = (rows as NewsletterRow[])
    .map((row: NewsletterRow) => {
      const pdfUrl = assetUrl(row.file as Parameters<typeof assetUrl>[0]);
      if (!pdfUrl) return null;
      return { id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt, content: row.content, categoryId: row.categoryId, publishedAt: row.published_at?.toISOString() ?? '', downloads: row.downloads, sizeMb: row.size_mb, pdfUrl, heroImage: getNewsletterHeroImage(row.hero_image) };
    })
    .filter((item: NewsletterItem | null): item is NewsletterItem => Boolean(item));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, totalPages, page: safePage, categories };
}
