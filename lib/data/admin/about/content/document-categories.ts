import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import { ABOUT_DOC_CATS_TAG } from '@/lib/cache/tags';

export type AdminDocumentCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rank: number;
  isActive: boolean;
  _count: { documents: number };
};

export const listDocumentCategories = async (): Promise<AdminDocumentCategoryRow[]> => {
  return db.documentCategory.findMany({
    orderBy: [{ rank: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      rank: true,
      isActive: true,
      _count: { select: { documents: true } },
    },
  });
};

export type AdminDocumentCategoryById = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rank: number;
  isActive: boolean;
};

export const getDocumentCategoryById = async (
  id: string,
): Promise<AdminDocumentCategoryById | null> => {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_DOC_CATS_TAG);

  return db.documentCategory.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      rank: true,
      isActive: true,
    },
  });
};
