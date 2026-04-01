import 'server-only';
import { db } from '@/lib/db';
import type { OrganizationSettingsData } from '@/lib/types/about';

export type OrgIntro = OrganizationSettingsData['introduction'];

export async function getOrgIntroduction(): Promise<OrgIntro | null> {
  const row = await db.organization.findFirst({
    select: {
      introTitle: true,
      introDescription: true,
      bannerImage: true,
      introImage: true,
    },
  });
  if (!row) return null;

  return {
    introTitle: row.introTitle ?? null,
    introDescription: row.introDescription ?? null,
    bannerImage: row.bannerImage as OrgIntro['bannerImage'],
    introImage: row.introImage as OrgIntro['introImage'],
  };
}
