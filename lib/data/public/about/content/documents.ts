import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import type { Prisma } from '@/generated/prisma/client';

import { db } from '@/lib/db';
import { ABOUT_DOC_CATS_TAG, ABOUT_DOCS_TAG } from '@/lib/cache/tags';

export type PublicDocumentCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rank: number;
};

export type PublicDocument = {
  id: string;
  title: string;
  description: string | null;
  rank: number;
  category: { id: string; slug: string; name: string } | null;
  file: Prisma.JsonValue;
};

export const getPublicDocumentCategories = async (): Promise<PublicDocumentCategory[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag(ABOUT_DOC_CATS_TAG);
  cacheTag(ABOUT_DOCS_TAG);

  return db.documentCategory.findMany({
    where: { isActive: true },
    orderBy: [{ rank: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      rank: true,
    },
  });
};

export const getPublicDocuments = async (): Promise<PublicDocument[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag(ABOUT_DOCS_TAG);
  cacheTag(ABOUT_DOC_CATS_TAG);

  return db.organizationDocument.findMany({
    where: { published: true },
    orderBy: [{ rank: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      description: true,
      rank: true,
      file: true,
      category: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  });
};

