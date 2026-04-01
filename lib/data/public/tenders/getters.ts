import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { assetUrl } from '@/lib/assets/core';
import { db } from '@/lib/db';
import { TENDERS_TAG } from '@/lib/cache/tags';

export type TenderStatus = 'open' | 'awarded' | 'archived';
export type TenderFilter = { id: TenderStatus; label: string };
export type TenderItem = {
  id: string;
  title: string;
  summary: string;
  status: TenderStatus;
  updated: string;
  downloadUrl: string;
};

export const tenderStatuses: TenderFilter[] = [
  { id: 'open', label: 'Open Tenders' },
  { id: 'awarded', label: 'Awarded' },
  { id: 'archived', label: 'Archived' },
];

type TenderRow = Awaited<ReturnType<typeof db.tender.findMany>>[number];

export async function getPaginatedTenders(
  status: TenderStatus | undefined,
  page: number,
  pageSize: number,
): Promise<{ items: TenderItem[]; total: number; totalPages: number; page: number; statuses: TenderFilter[] }> {
  'use cache';
  cacheLife('weeks');
  cacheTag(TENDERS_TAG);

  const rows = await db.tender.findMany({
    where: { deleted_at: null, is_active: true, ...(status ? { status: status.toUpperCase() as 'OPEN' | 'AWARDED' | 'ARCHIVED' } : {}) },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
    select: { id: true, title: true, summary: true, status: true, file: true, updated_at: true },
  });

  const items = (rows as TenderRow[])
    .map((row: TenderRow) => {
      const downloadUrl = assetUrl(row.file as Parameters<typeof assetUrl>[0]);
      if (!downloadUrl) return null;
      return { id: row.id, title: row.title, summary: row.summary, status: row.status.toLowerCase() as TenderStatus, updated: row.updated_at.toISOString(), downloadUrl };
    })
    .filter((item: TenderItem | null): item is TenderItem => Boolean(item));

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, totalPages, page: safePage, statuses: tenderStatuses };
}
