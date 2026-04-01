import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import type { Prisma, ProjectStatus } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { PROJECTS_TAG } from '@/lib/cache/tags';

export type AdminProjectRow = {
  id: string;
  title: string;
  slug: string;
  categoryId: string | null;
  categoryName: string | null;
  status: ProjectStatus;
  short_description: string;
  content: string;
  hero_image: Prisma.JsonValue | null;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function listProjects(): Promise<AdminProjectRow[]> {
  return db.project
    .findMany({
      where: { deleted_at: null },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        categoryId: true,
        category: { select: { name: true } },
        status: true,
        short_description: true,
        content: true,
        hero_image: true,
        sort_order: true,
        created_at: true,
        updated_at: true,
      },
    })
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        categoryName: row.category?.name ?? null,
      })),
    );
}

export type AdminProjectById = {
  id: string;
  title: string;
  slug: string;
  categoryId: string | null;
  status: ProjectStatus;
  short_description: string;
  content: string;
  hero_image: Prisma.JsonValue | null;
  sort_order: number;
};

export async function getProjectById(id: string): Promise<AdminProjectById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(PROJECTS_TAG);

  return db.project.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      categoryId: true,
      status: true,
      short_description: true,
      content: true,
      hero_image: true,
      sort_order: true,
    },
  });
}
