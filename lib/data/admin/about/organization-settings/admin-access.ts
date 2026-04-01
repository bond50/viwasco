import 'server-only';
import { db } from '@/lib/db';

export type OrgAdminAccess = {
  emails: string[];
  bootstrap: boolean;
};

export async function getOrgAdminAccess(): Promise<OrgAdminAccess | null> {
  const row = await db.organization.findFirst({
    select: { adminAllowlist: true, adminBootstrap: true },
  });
  if (!row) return null;

  const emails = Array.isArray(row.adminAllowlist) ? (row.adminAllowlist as string[]) : [];
  return { emails, bootstrap: !!row.adminBootstrap };
}
