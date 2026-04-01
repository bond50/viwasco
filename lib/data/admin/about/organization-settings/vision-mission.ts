import 'server-only';
import { db } from '@/lib/db';
import type { OrganizationSettingsData } from '@/lib/types/about';

export type OrgVisionMission = OrganizationSettingsData['visionMission'];

export async function getOrgVisionMission(): Promise<OrgVisionMission | null> {
  const row = await db.organization.findFirst({
    select: {
      vision: true,
      mission: true,
      visionIcon: true,
      missionIcon: true,
    },
  });
  if (!row) return null;

  return {
    vision: row.vision ?? null,
    mission: row.mission ?? null,
    visionIcon: row.visionIcon ?? null,
    missionIcon: row.missionIcon ?? null,
  };
}
