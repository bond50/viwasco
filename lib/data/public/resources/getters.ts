import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { assetUrl, ensureUploadedAsset, isFileAsset, isImageAsset } from '@/lib/assets/core';
import { db } from '@/lib/db';
import { RESOURCES_TAG } from '@/lib/cache/tags';
import { failSoftPublicQuery } from '@/lib/data/public/failsafe';

export type ResourceKind = string;

export type ResourceCategory = {
  id: string;
  label: string;
};

export type ResourceDoc = {
  id: string;
  title: string;
  summary: string;
  type: 'pdf' | 'doc' | 'xls' | 'link';
  categoryId: string;
  updated: string;
  downloadUrl: string;
};

export type ResourceSection = {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  count: number;
};

function inferResourceType(file: unknown): ResourceDoc['type'] {
  const asset = ensureUploadedAsset(file);
  if (!asset) return 'link';

  if (Array.isArray(asset)) {
    return inferResourceType(asset[0] ?? null);
  }

  if (isImageAsset(asset)) {
    return 'pdf';
  }

  if (isFileAsset(asset)) {
    const fmt = typeof asset.format === 'string' ? asset.format.toLowerCase() : '';
    if (fmt === 'pdf') return 'pdf';
    if (fmt === 'doc' || fmt === 'docx') return 'doc';
    if (fmt === 'xls' || fmt === 'xlsx' || fmt === 'csv') return 'xls';
  }

  return 'link';
}

export async function getResourceSections(): Promise<ResourceSection[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(RESOURCES_TAG);

  const rows = await failSoftPublicQuery(
    db.resourceKind.findMany({
      where: { deleted_at: null, is_active: true },
      orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        _count: { select: { resources: true } },
      },
    }),
    { label: 'getResourceSections', fallback: [] },
  );

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    summary: row.description?.trim() || null,
    count: row._count.resources,
  }));
}

export async function getResourceSectionBySlug(slug: string): Promise<ResourceSection | null> {
  const sections = await getResourceSections();
  return sections.find((section) => section.slug === slug) ?? null;
}

export async function getPaginatedResources(
  kind: ResourceKind,
  categoryId: string | undefined,
  page: number,
  pageSize: number,
): Promise<{
  items: ResourceDoc[];
  total: number;
  totalPages: number;
  page: number;
  categories: ResourceCategory[];
}> {
  'use cache';
  cacheLife('weeks');
  cacheTag(RESOURCES_TAG);

  const kindRow = await db.resourceKind.findUnique({
    where: { slug: kind },
    select: { id: true },
  });

  if (!kindRow) {
    return { items: [], total: 0, totalPages: 1, page: 1, categories: [] };
  }

  const categories = await db.resourceCategory.findMany({
    where: { kindId: kindRow.id, deleted_at: null, is_active: true },
    orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true },
  });

  const rows = await db.resource.findMany({
    where: {
      kindId: kindRow.id,
      deleted_at: null,
      is_active: true,
    },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
    select: {
      id: true,
      title: true,
      summary: true,
      file: true,
      categoryId: true,
      updated_at: true,
    },
  });

  const sourceItems: ResourceDoc[] = rows
    .map((row) => {
      const downloadUrl = assetUrl(row.file as Parameters<typeof assetUrl>[0]);
      if (!downloadUrl) return null;

      return {
        id: row.id,
        title: row.title,
        summary: row.summary,
        type: inferResourceType(row.file),
        categoryId: row.categoryId ?? '',
        updated: row.updated_at.toISOString(),
        downloadUrl,
      };
    })
    .filter((item): item is ResourceDoc => Boolean(item));

  const filtered = categoryId
    ? sourceItems.filter((item) => item.categoryId === categoryId)
    : sourceItems;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total,
    totalPages,
    page: safePage,
    categories: categories.map((category) => ({
      id: category.id,
      label: category.name,
    })),
  };
}
