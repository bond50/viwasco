// lib/data/admin/about/content/milestones.ts
import 'server-only';
import { db } from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ABOUT_MILESTONES_TAG } from '@/lib/cache/tags';

export type AdminMilestoneRow = {
  id: string;
  title: string;
  summary: string | null;
  year: number | null;
  date: Date | null;
  image: unknown | null;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function listMilestones(): Promise<AdminMilestoneRow[]> {
  return db.organizationMilestone.findMany({
    orderBy: { rank: 'asc' },
    select: {
      id: true,
      title: true,
      summary: true,
      year: true,
      date: true,
      image: true,
      rank: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getMilestoneById(id: string): Promise<AdminMilestoneRow | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_MILESTONES_TAG);

  return db.organizationMilestone.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      summary: true,
      year: true,
      date: true,
      image: true,
      rank: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
