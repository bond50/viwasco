import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import type { ProjectStatus as DbProjectStatus } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { PROJECTS_TAG } from '@/lib/cache/tags';
import { ensureUploadedImage, getBestImageUrl } from '@/lib/assets/core';

export type ProjectStatus = 'ongoing' | 'completed';

export type PublicProjectCard = {
  id: string;
  slug: string;
  title: string;
  status: ProjectStatus;
  shortDescription: string;
  content: string;
  heroImage: string;
  updatedAt: string;
};

export type PublicProjectDetail = PublicProjectCard;

function toPublicStatus(status: DbProjectStatus): ProjectStatus {
  return status.toLowerCase() as ProjectStatus;
}

function toHeroImage(value: unknown): string {
  const image = ensureUploadedImage(value);
  return (
    getBestImageUrl(image, ['cover', 'wide', 'large', 'medium', 'small']) ||
    '/assets/img/featured-default.jpg'
  );
}

export async function getProjectBySlug(
  slug: string,
): Promise<PublicProjectDetail | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag(PROJECTS_TAG);

  const row = await db.project.findFirst({
    where: {
      slug,
      deleted_at: null,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      short_description: true,
      content: true,
      hero_image: true,
      updated_at: true,
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: toPublicStatus(row.status),
    shortDescription: row.short_description,
    content: row.content,
    heroImage: toHeroImage(row.hero_image),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function getProjects(): Promise<PublicProjectCard[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(PROJECTS_TAG);

  const rows = await db.project.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      short_description: true,
      content: true,
      hero_image: true,
      updated_at: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: toPublicStatus(row.status),
    shortDescription: row.short_description,
    content: row.content,
    heroImage: toHeroImage(row.hero_image),
    updatedAt: row.updated_at.toISOString(),
  }));
}

export async function getProjectsByStatus(
  status?: ProjectStatus,
): Promise<PublicProjectCard[]> {
  const items = await getProjects();
  return status ? items.filter((project) => project.status === status) : items;
}

export async function getPaginatedProjects(
  status: ProjectStatus | undefined,
  page: number,
  pageSize: number,
): Promise<{
  items: PublicProjectCard[];
  total: number;
  totalPages: number;
  page: number;
}> {
  const items = await getProjects();
  const filtered = status
    ? items.filter((project) => project.status === status)
    : items;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  return { items: rows, total, totalPages, page: safePage };
}
