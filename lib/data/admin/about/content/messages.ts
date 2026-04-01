// lib/data/admin/about/content/team-messages.ts
import 'server-only';
import { db } from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ABOUT_LEADERSHIP_TEAM_TAG, ABOUT_MESSAGES_TAG } from '@/lib/cache/tags';

export type AdminMessageRow = {
  id: string;
  title: string;
  excerpt: string | null;
  published: boolean;
  authorTeamId: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorTeam: {
    id: string;
    name: string;
    position: string | null;
    rank: number;
    image: unknown | null;
  } | null;
};

export async function listMessages(): Promise<AdminMessageRow[]> {
  return db.organizationMessage.findMany({
    orderBy: [{ authorTeam: { rank: 'asc' } }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      excerpt: true,
      published: true,
      authorTeamId: true,
      createdAt: true,
      updatedAt: true,
      authorTeam: { select: { id: true, name: true, position: true, rank: true, image: true } },
    },
  });
}

export type AdminMessageById = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
  authorTeamId: string | null;
  authorTeam: {
    id: string;
    name: string;
    position: string | null;
    rank: number;
    image: unknown | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getMessageById(id: string): Promise<AdminMessageById | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_MESSAGES_TAG);
  cacheTag(ABOUT_LEADERSHIP_TEAM_TAG);

  return db.organizationMessage.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      excerpt: true,
      body: true,
      published: true,
      authorTeamId: true,
      authorTeam: { select: { id: true, name: true, position: true, rank: true, image: true } },
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function listLeadersForSelect(): Promise<Array<{ value: string; label: string }>> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_LEADERSHIP_TEAM_TAG);

  const leaders = await db.managementTeam.findMany({
    where: { isActive: true },
    orderBy: { rank: 'asc' },
    select: { id: true, name: true, position: true, rank: true },
  });

  return leaders.map((l) => {
    const rankPart = typeof l.rank === 'number' ? ` (Rank #${l.rank})` : '';
    const positionPart = l.position ?? 'Leader';

    return {
      value: l.id,
      label: `${l.name} — ${positionPart}${rankPart}`,
    };
  });
}
