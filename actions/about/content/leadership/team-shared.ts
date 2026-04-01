import 'server-only';

import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { requireCurrentUser } from '@/lib/auth/auth-utils';
import {
  ABOUT_LEADERSHIP_CATS_TAG,
  ABOUT_LEADERSHIP_TEAM_TAG,
  ABOUT_NAV_TAG,
} from '@/lib/cache/tags';

export const TEAM_REVALIDATE_PATH = '/dashboard/about/leadership/teams';
export const TEAM_REVALIDATE_PATH_PUBLIC = '/about/leadership';

export const TEAM_REVALIDATE_TAGS: readonly string[] = [
  ABOUT_LEADERSHIP_TEAM_TAG,
  ABOUT_LEADERSHIP_CATS_TAG,
  ABOUT_NAV_TAG,
] as const;

export function asSocialLinksArray(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  if (v == null || v === '') return [];
  return [];
}

export async function computeUniqueTeamSlug(name: string, excludeId?: string): Promise<string> {
  const root = slugify(name);
  return uniqueSlug(root, async (candidate) => {
    const count = await db.managementTeam.count({
      where: excludeId ? { slug: candidate, NOT: { id: excludeId } } : { slug: candidate },
    });
    return count > 0;
  });
}

export async function secureMutatingAction() {
  await requireCurrentUser();
}

export function revalidateTeamsAll() {
  revalidatePath(TEAM_REVALIDATE_PATH);
  revalidatePath(TEAM_REVALIDATE_PATH_PUBLIC);
  revalidateTag(ABOUT_LEADERSHIP_TEAM_TAG, 'max');
  revalidateTag(ABOUT_LEADERSHIP_CATS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
}
