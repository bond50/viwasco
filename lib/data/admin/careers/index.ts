import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { CAREERS_TAG } from '@/lib/cache/tags';

export type AdminCareerRow = {
  id: string;
  typeId: string;
  typeName: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  summary: string | null;
  file: unknown;
  closing_at: Date | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function listCareers(): Promise<AdminCareerRow[]> {
  return db.career
    .findMany({
      where: { deleted_at: null },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
      select: {
        id: true,
        typeId: true,
        type: { select: { name: true } },
        title: true,
        slug: true,
        department: true,
        location: true,
        summary: true,
        file: true,
        closing_at: true,
        is_active: true,
        sort_order: true,
        created_at: true,
        updated_at: true,
      },
    })
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        typeName: row.type.name,
      })),
    );
}

export type AdminCareerById = {
  id: string;
  typeId: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  summary: string | null;
  file: unknown;
  closing_at: Date | null;
  is_active: boolean;
  sort_order: number;
};

export async function getCareerById(id: string): Promise<AdminCareerById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(CAREERS_TAG);

  return db.career.findUnique({
    where: { id },
    select: {
      id: true,
      typeId: true,
      title: true,
      slug: true,
      department: true,
      location: true,
      summary: true,
      file: true,
      closing_at: true,
      is_active: true,
      sort_order: true,
    },
  });
}
