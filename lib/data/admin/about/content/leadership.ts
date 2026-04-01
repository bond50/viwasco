// lib/data/admin/about/content/leadership.ts
import 'server-only';
import { db } from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ABOUT_LEADERSHIP_CATS_TAG, ABOUT_LEADERSHIP_TEAM_TAG } from '@/lib/cache/tags';

import type { LeadershipCategoryType, Prisma } from '@/generated/prisma/client';
import { AdminTeamEducationRow } from '@/lib/types/about/leadership';

export type AdminLeadershipCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rank: number;
  categoryType: LeadershipCategoryType;
  _count: { teamMembers: number };
};

export async function listTeamEducations(teamId: string): Promise<AdminTeamEducationRow[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_LEADERSHIP_TEAM_TAG);

  return db.teamEducation.findMany({
    where: { teamId },
    orderBy: [{ rank: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      teamId: true,
      institution: true,
      qualification: true,
      level: true,
      field: true,
      startDate: true,
      endDate: true,
      isCurrent: true,
      description: true,
      logo: true,
      honor: true,
      rank: true,
    },
  });
}
export async function listCategories(): Promise<AdminLeadershipCategoryRow[]> {
  'use cache';
  cacheLife('days');
  cacheTag(ABOUT_LEADERSHIP_CATS_TAG);
  return db.managementCategory.findMany({
    orderBy: [{ rank: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      rank: true,
      categoryType: true,
      _count: { select: { teamMembers: true } },
    },
  });
}

export type AdminLeadershipCategoryById = Omit<AdminLeadershipCategoryRow, '_count'>;

export async function getCategoryById(id: string): Promise<AdminLeadershipCategoryById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_LEADERSHIP_CATS_TAG);

  return db.managementCategory.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      rank: true,
      categoryType: true,
    },
  });
}

export type AdminTeamRow = {
  id: string;
  name: string;
  position: string;
  slug: string;
  rank: number;
  isFeatured: boolean;
  isActive: boolean;
  image: Prisma.JsonValue | null;
};

export async function listTeamsByCategory(categoryId: string): Promise<AdminTeamRow[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_LEADERSHIP_TEAM_TAG);
  cacheTag(ABOUT_LEADERSHIP_CATS_TAG);

  return db.managementTeam.findMany({
    where: { categoryId },
    orderBy: [{ rank: 'asc' }],
    select: {
      id: true,
      name: true,
      position: true,
      slug: true,
      rank: true,
      isFeatured: true,
      isActive: true,
      image: true,
    },
  });
}

export type AdminTeamById = AdminTeamRow & {
  categoryId: string;
  bio: string | null;
  socialLinks: Prisma.JsonValue | null;
  category: { id: string; name: string };
};

export async function getTeamById(id: string): Promise<AdminTeamById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_LEADERSHIP_TEAM_TAG);
  cacheTag(ABOUT_LEADERSHIP_CATS_TAG);

  return db.managementTeam.findUnique({
    where: { id },
    select: {
      id: true,
      categoryId: true,
      name: true,
      position: true,
      bio: true,
      slug: true,
      rank: true,
      isFeatured: true,
      isActive: true,
      image: true,
      socialLinks: true,
      category: { select: { id: true, name: true } },
    },
  });
}
