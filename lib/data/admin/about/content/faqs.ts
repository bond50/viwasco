// lib/data/admin/about/content/faqs.ts
import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import { ABOUT_FAQS_TAG } from '@/lib/cache/tags';

export type AdminFaqRow = {
  id: string;
  question: string;
  answer: string;
  published: boolean;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
};

export const listFaqs = async (): Promise<AdminFaqRow[]> => {
  return db.organizationFaq.findMany({
    orderBy: [{ rank: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      question: true,
      answer: true,
      published: true,
      rank: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getFaqById = async (id: string): Promise<AdminFaqRow | null> => {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_FAQS_TAG);

  return db.organizationFaq.findUnique({
    where: { id },
    select: {
      id: true,
      question: true,
      answer: true,
      published: true,
      rank: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
