import 'server-only';
import { db } from '@/lib/db';

import type { OrganizationSettingsData } from '@/lib/types/about';

export type OrgBasic = OrganizationSettingsData['basic'];

export async function getOrgBasic(): Promise<OrgBasic | null> {
  const row = await db.organization.findFirst({
    select: {
      name: true,
      tagline: true,
      shortName: true,
      logo: true,
      featuredImage: true,
    },
  });
  if (!row) return null;

  return {
    name: row.name,
    tagline: row.tagline ?? '',
    shortName: row.shortName ?? '',
    logo: row.logo as OrgBasic['logo'],
    featuredImage: row.featuredImage as OrgBasic['featuredImage'],
  };
}
