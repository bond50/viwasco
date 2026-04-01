// lib/data/admin/about/content/awards.ts
import 'server-only';

import type { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ABOUT_AWARDS_TAG } from '@/lib/cache/tags';

export type AdminAwardRow = {
  id: string;
  title: string;
  issuer: string | null;
  date: Date | null;
  summary: string | null;
  badge: Prisma.JsonValue | null;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
};

export const listAwards = async (): Promise<AdminAwardRow[]> => {
  return db.organizationAward.findMany({
    orderBy: [{ rank: 'asc' }, { date: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      issuer: true,
      date: true,
      summary: true,
      badge: true,
      rank: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export type AdminAwardById = {
  id: string;
  title: string;
  issuer: string | null;
  date: Date | null;
  summary: string | null;
  badge: Prisma.JsonValue | null;
  rank: number;
};

export const getAwardById = async (id: string): Promise<AdminAwardById | null> => {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_AWARDS_TAG);

  return db.organizationAward.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      issuer: true,
      date: true,
      summary: true,
      badge: true,
      rank: true,
    },
  });
};
