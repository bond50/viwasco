// actions/organization/social-hours.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import { processSocialLinks } from '@/lib/social-links';
import type { ActionState } from '@/lib/types/action-state';
import {
  organisationSocialHoursSchema,
  type OrganisationSocialHoursValues,
} from '@/lib/schemas/about/organization/social-hours';
import { ABOUT_NAV_TAG, ORG_ORGANIZATION_TAG, ORG_SOCIAL_HOURS_TAG } from '@/lib/cache/tags';

export async function updateOrganizationSocialHours(
  orgId: string,
  _prev: ActionState<OrganisationSocialHoursValues>,
  formData: FormData,
) {
  if (!orgId) throw new Error('Missing organization id.');

  return executeAction<OrganisationSocialHoursValues>({
    schema: organisationSocialHoursSchema,
    formData,
    jsonFields: ['socialLinks', 'workingHours'],
    execute: async (data) => {
      const patch: Prisma.OrganizationUpdateInput = {};

      if (typeof data.socialLinks !== 'undefined') {
        patch.socialLinks = jsonForPrisma(processSocialLinks(data.socialLinks ?? []));
      }
      if (typeof data.workingHours !== 'undefined') {
        patch.workingHours = jsonForPrisma(data.workingHours ?? []);
      }

      await db.organization.update({ where: { id: orgId }, data: patch });
    },
    revalidateTags: [ORG_SOCIAL_HOURS_TAG, ORG_ORGANIZATION_TAG, ABOUT_NAV_TAG],
    revalidatePaths: ['/dashboard/about/organization'],
  });
}
