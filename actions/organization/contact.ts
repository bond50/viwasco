// actions/organization/contact.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import {
  organisationContactSchema,
  type OrganisationContactValues,
} from '@/lib/schemas/about/organization/contact';
import type { ActionState } from '@/lib/types/action-state';
import { ORG_CONTACT_TAG, ORG_ORGANIZATION_TAG } from '@/lib/cache/tags';

const navigationDefaults = {
  about: true,
  services: true,
  projects: true,
  resources: true,
  news: true,
  tenders: true,
  careers: true,
  newsletters: true,
  contact: true,
};

function normalizeRecipientEmails(emails: string[] = []): string[] {
  return Array.from(
    new Set(emails.map((email) => email.trim().toLowerCase()).filter((email) => email.length > 0)),
  ).sort();
}

export async function updateOrganizationContact(
  orgId: string,
  _prev: ActionState<OrganisationContactValues>,
  formData: FormData,
) {
  if (!orgId) throw new Error('Missing organization id.');

  return executeAction<OrganisationContactValues>({
    schema: organisationContactSchema,
    formData,
    jsonFields: ['serviceCentres', 'navigationVisibility', 'contactRecipientEmails'],
    execute: async (data) => {
      if (data.contactEmail) {
        const conflict = await db.organization.findFirst({
          where: { id: { not: orgId }, contactEmail: data.contactEmail },
          select: { id: true },
        });
        if (conflict) {
          throw new Error('Another organization with this email already exists');
        }
      }

      const patch: Prisma.OrganizationUpdateInput = {};
      if (typeof data.websiteUrl !== 'undefined') patch.websiteUrl = data.websiteUrl;
      if (typeof data.contactEmail !== 'undefined') patch.contactEmail = data.contactEmail;
      if (typeof data.phone !== 'undefined') patch.phone = data.phone;
      if (typeof data.address !== 'undefined') patch.address = data.address;
      if (typeof data.footerAboutText !== 'undefined') {
        patch.footerAboutText = data.footerAboutText?.trim() || null;
      }
      if (typeof data.customerPortalEnabled !== 'undefined') {
        patch.customerPortalEnabled = data.customerPortalEnabled;
      }
      if (typeof data.customerPortalLabel !== 'undefined') {
        patch.customerPortalLabel = data.customerPortalLabel?.trim() || null;
      }
      if (typeof data.customerPortalUrl !== 'undefined') {
        patch.customerPortalUrl = data.customerPortalUrl?.trim() || null;
      }
      if (typeof data.serviceCentres !== 'undefined') {
        patch.serviceCentres = jsonForPrisma(
          (data.serviceCentres ?? [])
            .map((centre) => ({
              name: centre.name.trim(),
              address: centre.address.trim(),
            }))
            .filter((centre) => centre.name.length > 0 && centre.address.length > 0),
        );
      }

      const current = await db.organization.findUnique({
        where: { id: orgId },
        select: { metadata: true },
      });
      const meta = (current?.metadata ?? {}) as Record<string, unknown>;
      const currentNavigation =
        meta.navigation && typeof meta.navigation === 'object'
          ? (meta.navigation as Record<string, unknown>)
          : {};
      const nextMetadata: Record<string, unknown> = { ...meta };

      if (typeof data.navigationVisibility !== 'undefined') {
        nextMetadata.navigation = {
          ...navigationDefaults,
          ...currentNavigation,
          ...data.navigationVisibility,
        };
      }

      if (typeof data.contactRecipientEmails !== 'undefined') {
        nextMetadata.contactMessageRecipients = normalizeRecipientEmails(
          data.contactRecipientEmails ?? [],
        );
      }

      patch.metadata = nextMetadata as Prisma.InputJsonValue;

      await db.organization.update({ where: { id: orgId }, data: patch });
    },
    revalidateTags: [ORG_CONTACT_TAG, ORG_ORGANIZATION_TAG],
    revalidatePaths: ['/dashboard/about/organization'],
  });
}
