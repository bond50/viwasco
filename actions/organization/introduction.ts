// actions/organization/introduction.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';
import {
  organisationIntroductionSchema,
  type OrganisationIntroductionValues,
} from '@/lib/schemas/about/organization/introduction';
import { ORG_HERO_TAG, ORG_INTRO_TAG } from '@/lib/cache/tags';

export async function updateOrganizationIntroduction(
  orgId: string,
  _prev: ActionState<OrganisationIntroductionValues>,
  formData: FormData,
) {
  if (!orgId) throw new Error('Missing organization id.');

  return executeAction<OrganisationIntroductionValues>({
    schema: organisationIntroductionSchema,
    formData,
    fileFields: ['bannerImage', 'introImage'],
    execute: async (data) => {
      const patch: Prisma.OrganizationUpdateInput = {};

      if (typeof data.introTitle !== 'undefined') {
        patch.introTitle = data.introTitle;
      }
      if (typeof data.introDescription !== 'undefined') {
        patch.introDescription = data.introDescription;
      }
      if (typeof data.bannerImage !== 'undefined') {
        patch.bannerImage = jsonForPrisma(data.bannerImage ?? null);
      }
      if (typeof data.introImage !== 'undefined') {
        patch.introImage = jsonForPrisma(data.introImage ?? null);
      }

      await db.organization.update({ where: { id: orgId }, data: patch });
    },
    revalidateTags: [ORG_INTRO_TAG, ORG_HERO_TAG],
    revalidatePaths: ['/dashboard/about/organization'],
  });
}
