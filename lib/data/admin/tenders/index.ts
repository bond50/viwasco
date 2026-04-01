import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { TENDERS_TAG } from '@/lib/cache/tags';

export type AdminTenderRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  summary: string;
  file: unknown;
  published_at: Date | null;
  closing_at: Date | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function listTenders(): Promise<AdminTenderRow[]> {
  return db.tender.findMany({
    where: { deleted_at: null },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      summary: true,
      file: true,
      published_at: true,
      closing_at: true,
      is_active: true,
      sort_order: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export type AdminTenderById = AdminTenderRow;

export async function getTenderById(id: string): Promise<AdminTenderById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(TENDERS_TAG);

  return db.tender.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      summary: true,
      file: true,
      published_at: true,
      closing_at: true,
      is_active: true,
      sort_order: true,
      created_at: true,
      updated_at: true,
    },
  });
}
