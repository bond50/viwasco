import 'server-only';
import { db } from '@/lib/db';
import type { OrganizationSettingsData } from '@/lib/types/about';

export type OrgCoreValuesHeader = OrganizationSettingsData['coreValuesHeader'];

export async function getOrgCoreValuesHeader(): Promise<OrgCoreValuesHeader | null> {
  const row = await db.organization.findFirst({
    select: {
      coreValuesLeadText: true,
      coreValuesImage: true,
    },
  });
  if (!row) return null;

  return {
    coreValuesLeadText: row.coreValuesLeadText ?? null,
    coreValuesImage: row.coreValuesImage as OrgCoreValuesHeader['coreValuesImage'],
  };
}
