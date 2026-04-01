import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { CAREER_TYPES_TAG } from '@/lib/cache/tags';

export type CareerType = {
  id: string;
  slug: string;
  label: string;
};

export type AdminCareerTypeRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function listCareerTypes(): Promise<AdminCareerTypeRow[]> {
  return db.careerType.findMany({
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

export async function getCareerTypeById(id: string): Promise<AdminCareerTypeRow | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(CAREER_TYPES_TAG);

  return db.careerType.findUnique({
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
