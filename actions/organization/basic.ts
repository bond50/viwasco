// actions/organization/basic.ts (or your actual path)
'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { slugify } from '@/lib/slugify';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrismaRequired } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';
import {
  organisationBasicSchema,
  type OrganisationBasicValues,
} from '@/lib/schemas/about/organization/basic';
import { ORG_BASIC_TAG } from '@/lib/cache/tags';

export async function updateOrganizationBasic(
  orgId: string,
  _prev: ActionState<OrganisationBasicValues>,
  formData: FormData,
) {
  if (!orgId) throw new Error('Missing organization id.');

  return executeAction<OrganisationBasicValues>({
    schema: organisationBasicSchema,
    formData,
    fileFields: ['logo', 'featuredImage'],
    execute: async (data) => {
      const maybeSlug = slugify(data.slug || data.name);

      const patch: Prisma.OrganizationUpdateInput = {
        name: data.name,
        ...(maybeSlug ? { slug: maybeSlug } : {}),
        tagline: data.tagline || '',
        shortName: data.shortName || '',
      };

      const toJson = (v: unknown) => (v === null ? Prisma.JsonNull : jsonForPrismaRequired(v));

      if (data.logo !== undefined) {
        patch.logo = toJson(data.logo);
      }
      if (data.featuredImage !== undefined) {
        patch.featuredImage = toJson(data.featuredImage);
      }

      await db.organization.update({
        where: { id: orgId },
        data: patch,
      });
    },
    revalidateTags: [ORG_BASIC_TAG],
    revalidatePaths: ['/dashboard/about/organization'],
  });
}
