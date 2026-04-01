import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import type { Prisma } from '@/generated/prisma/client';

import { db } from '@/lib/db';
import { ABOUT_DOC_CATS_TAG, ABOUT_DOCS_TAG } from '@/lib/cache/tags';

export type AdminDocumentRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published: boolean;
  rank: number;
  category: { id: string; name: string } | null;
  createdAt: Date;
  updatedAt: Date;
};

export const listDocuments = async (): Promise<AdminDocumentRow[]> => {
  return db.organizationDocument.findMany({
    orderBy: [{ rank: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      published: true,
      rank: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export type AdminDocumentById = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published: boolean;
  rank: number;
  categoryId: string | null;
  file: Prisma.JsonValue;
};

export const getDocumentById = async (id: string): Promise<AdminDocumentById | null> => {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_DOCS_TAG);
  cacheTag(ABOUT_DOC_CATS_TAG);

  return db.organizationDocument.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      published: true,
      rank: true,
      categoryId: true,
      file: true,
    },
  });
};
