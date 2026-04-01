// lib/data/admin/about/content/parners.ts
import 'server-only';
import { db } from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ABOUT_PARTNERS_TAG } from '@/lib/cache/tags';

export type AdminPartnerRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  partnershipType: string | null;
  rank: number;
  isActive: boolean;
  logo: unknown | null;
};

export async function listPartners(): Promise<AdminPartnerRow[]> {
  return db.partner.findMany({
    orderBy: [{ rank: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      website: true,
      partnershipType: true,
      rank: true,
      isActive: true,
      logo: true,
    },
  });
}

export async function getPartnerById(id: string): Promise<AdminPartnerRow | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_PARTNERS_TAG);

  return db.partner.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      website: true,
      partnershipType: true,
      rank: true,
      isActive: true,
      logo: true,
    },
  });
}
