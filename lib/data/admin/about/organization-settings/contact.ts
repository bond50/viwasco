import 'server-only';
import { db } from '@/lib/db';
import type { OrganizationSettingsData } from '@/lib/types/about';

export type OrgContact = OrganizationSettingsData['contact'];

export async function getOrgContact(): Promise<OrgContact | null> {
  const row = await db.organization.findFirst({
    select: {
      websiteUrl: true,
      contactEmail: true,
      phone: true,
      address: true,
      footerAboutText: true,
      customerPortalEnabled: true,
      customerPortalLabel: true,
      customerPortalUrl: true,
      serviceCentres: true,
      metadata: true,
    },
  });
  if (!row) return null;

  const metadata =
    row.metadata && typeof row.metadata === 'object'
      ? (row.metadata as Record<string, unknown>)
      : {};
  const navigation =
    metadata.navigation && typeof metadata.navigation === 'object'
      ? (metadata.navigation as OrgContact['navigationVisibility'])
      : null;
  const contactMessageRecipients = Array.isArray(metadata.contactMessageRecipients)
    ? metadata.contactMessageRecipients
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim().toLowerCase())
        .filter((value, index, all) => value.length > 0 && all.indexOf(value) === index)
    : [];

  return {
    websiteUrl: row.websiteUrl ?? null,
    contactEmail: row.contactEmail ?? null,
    contactRecipientEmails: contactMessageRecipients,
    phone: row.phone ?? null,
    address: row.address ?? null,
    footerAboutText: row.footerAboutText ?? null,
    customerPortalEnabled: row.customerPortalEnabled ?? false,
    customerPortalLabel: row.customerPortalLabel ?? null,
    customerPortalUrl: row.customerPortalUrl ?? null,
    navigationVisibility: navigation,
    serviceCentres: Array.isArray(row.serviceCentres)
      ? (row.serviceCentres as OrgContact['serviceCentres'])
      : [],
  };
}
