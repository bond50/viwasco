import 'server-only';
import { db } from '@/lib/db';
import type { OrganizationSettingsData } from '@/lib/types/about';

export type OrgIdentity = {
  id: string;
  name: string;
  flags: OrganizationSettingsData['flags'];
};

export async function getOrgIdentity(): Promise<OrgIdentity | null> {
  const row = await db.organization.findFirst({
    select: {
      id: true,
      name: true,
      isActive: true,
      isFeatured: true,
      isVerified: true,
      metadata: true,
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    flags: {
      isActive: !!row.isActive,
      isFeatured: !!row.isFeatured,
      isVerified: !!row.isVerified,
      metadata: row.metadata ? JSON.stringify(row.metadata) : '',
    },
  };
}
