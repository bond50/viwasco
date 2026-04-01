import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { NEWSLETTER_CATEGORIES_TAG } from '@/lib/cache/tags';

export type NewsletterCategory = {
  id: string;
  slug: string;
  label: string;
};

export type AdminNewsletterCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function listNewsletterCategories(): Promise<AdminNewsletterCategoryRow[]> {
  return db.newsletterCategory.findMany({
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

export async function getNewsletterCategoryById(
  id: string,
): Promise<AdminNewsletterCategoryRow | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(NEWSLETTER_CATEGORIES_TAG);

  return db.newsletterCategory.findUnique({
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
