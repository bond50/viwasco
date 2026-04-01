import 'server-only';
import { db } from '@/lib/db';
import type { OrganizationSettingsData } from '@/lib/types/about';

export type OrgSocialHours = OrganizationSettingsData['socialHours'];

export async function getOrgSocialHours(): Promise<OrgSocialHours | null> {
  const row = await db.organization.findFirst({
    select: {
      socialLinks: true,
      workingHours: true,
    },
  });
  if (!row) return null;

  return {
    socialLinks: row.socialLinks as OrgSocialHours['socialLinks'],
    workingHours: row.workingHours as OrgSocialHours['workingHours'],
  };
}
