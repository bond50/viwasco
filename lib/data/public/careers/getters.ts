import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { assetUrl } from '@/lib/assets/core';
import { db } from '@/lib/db';
import { CAREER_TYPES_TAG, CAREERS_TAG } from '@/lib/cache/tags';
import { failSoftPublicQuery } from '@/lib/data/public/failsafe';

export type CareerType = { id: string; slug: string; label: string };
export type JobItem = {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  closingDate: string;
  pdfUrl: string;
};

type CareerTypeRow = { id: string; slug: string; name: string };
type CareerQueryRow = {
  id: string;
  title: string;
  department: string;
  location: string;
  file: unknown;
  closing_at: Date | null;
  type: { name: string };
};

export async function getCareerTypes(): Promise<CareerType[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CAREER_TYPES_TAG);
  const rows = await failSoftPublicQuery(
    db.careerType.findMany({
      where: { deleted_at: null, is_active: true },
      orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
      select: { id: true, slug: true, name: true },
    }),
    { label: 'getCareerTypes', fallback: [] },
  );
  return (rows as CareerTypeRow[]).map((row: CareerTypeRow) => ({ id: row.id, slug: row.slug, label: row.name }));
}

export async function getPaginatedCareers(
  typeSlug: string | undefined,
  page: number,
  pageSize: number,
): Promise<{ items: JobItem[]; total: number; totalPages: number; page: number; types: CareerType[] }> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CAREERS_TAG);
  const types = await getCareerTypes();
  const typeRow = typeSlug ? await db.careerType.findUnique({ where: { slug: typeSlug }, select: { id: true } }) : null;
  const rows = await db.career.findMany({
    where: { deleted_at: null, is_active: true, ...(typeRow ? { typeId: typeRow.id } : {}) },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
    select: { id: true, title: true, department: true, location: true, file: true, closing_at: true, type: { select: { name: true } } },
  });
  const items = (rows as unknown as CareerQueryRow[])
    .map((row: CareerQueryRow) => {
      const pdfUrl = assetUrl(row.file as Parameters<typeof assetUrl>[0]);
      if (!pdfUrl) return null;
      return { id: row.id, title: row.title, department: row.department, type: row.type.name, location: row.location, closingDate: row.closing_at ? row.closing_at.toISOString().slice(0, 10) : '', pdfUrl };
    })
    .filter((item: JobItem | null): item is JobItem => Boolean(item));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, totalPages, page: safePage, types };
}
