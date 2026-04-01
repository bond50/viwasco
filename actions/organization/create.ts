// actions/organization/create.ts
'use server';

import { db } from '@/lib/db';
import { slugify } from '@/lib/slugify';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrismaRequired } from '@/lib/actions/json-helpers';

import type { OrganizationFormValues } from '@/lib/types/about/organization-create';
import { organizationCreateSchema } from '@/lib/schemas/about/organization/organization';

import { ORG_BASIC_TAG, ORG_ORGANIZATION_TAG } from '@/lib/cache/tags';

export async function createOrganization(_prev: unknown, formData: FormData) {
  return executeAction<OrganizationFormValues>({
    schema: organizationCreateSchema,
    formData,
    // the form only posts these:
    fileFields: ['logo', 'featuredImage'],

    execute: async (data) => {
      // guard: only one org allowed
      const count = await db.organization.count();
      if (count > 0) {
        throw new Error('Only one organization is allowed. Edit the existing record.');
      }

      // optional uniqueness guard
      const conflict = await db.organization.findFirst({
        where: {
          OR: [{ name: data.name }, { contactEmail: data.contactEmail || undefined }],
        },
        select: { id: true },
      });
      if (conflict) {
        throw new Error('Organization with this name/email already exists');
      }

      // minimal insert: identity + basic only
      await db.organization.create({
        data: {
          name: data.name,
          shortName: data.shortName ?? '',
          tagline: data.tagline ?? '',
          contactEmail: data.contactEmail,
          slug: slugify(data.slug || data.name) || '',
          logo: jsonForPrismaRequired(data.logo),
          featuredImage: jsonForPrismaRequired(data.featuredImage),
        },
      });
    },

    // only the tags that this action affects:
    revalidateTags: [ORG_ORGANIZATION_TAG, ORG_BASIC_TAG],
    revalidatePaths: ['/dashboard/about/organization'],
  });
}
