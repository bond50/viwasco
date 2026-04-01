// lib/data/admin/about/content/core-values.ts
import 'server-only';
import { db } from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ABOUT_VALUES_TAG, ORG_CORE_VALUES_HEADER_TAG } from '@/lib/cache/tags';

export type AdminCoreValueRow = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  rank: number;
};

export async function listCoreValues(): Promise<AdminCoreValueRow[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_VALUES_TAG);

  return db.organizationValue.findMany({
    orderBy: { rank: 'asc' },
    select: { id: true, title: true, description: true, icon: true, rank: true },
  });
}

export type OrgCoreValuesFields = {
  id: string;
  coreValuesLeadText: string | null;
  coreValuesImage: unknown | null;
};

export async function getOrgCoreValuesFields(): Promise<OrgCoreValuesFields | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_VALUES_TAG);
  cacheTag(ORG_CORE_VALUES_HEADER_TAG);

  const org = await db.organization.findFirst({
    select: {
      id: true,
      coreValuesLeadText: true,
      coreValuesImage: true,
    },
  });
  return org ?? null;
}
