import 'server-only';
import { db } from '@/lib/db';
import type { OrganizationSettingsData } from '@/lib/types/about';

export type OrgLegal = OrganizationSettingsData['legal'];

export async function getOrgLegal(): Promise<OrgLegal | null> {
  const row = await db.organization.findFirst({
    select: {
      regulatorName: true,
      licenseNumber: true,
      licenseExpiry: true,
      customerCareHotline: true,
      whatsappNumber: true,
    },
  });
  if (!row) return null;

  return {
    regulatorName: row.regulatorName ?? null,
    licenseNumber: row.licenseNumber ?? null,
    licenseExpiry: row.licenseExpiry ?? null,
    customerCareHotline: row.customerCareHotline ?? null,
    whatsappNumber: row.whatsappNumber ?? null,
  };
}
