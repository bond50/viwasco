// actions/organization/core-core-values-header.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';
import {
  organisationCoreValuesHeaderSchema,
  type OrganisationCoreValuesHeaderValues,
} from '@/lib/schemas/about/organization/core-values-header';
import { ORG_CORE_VALUES_HEADER_TAG } from '@/lib/cache/tags';

export async function updateOrganizationCoreValuesHeader(
  orgId: string,
  _prev: ActionState<OrganisationCoreValuesHeaderValues>,
  formData: FormData,
) {
  if (!orgId) throw new Error('Missing organization id.');

  return executeAction<OrganisationCoreValuesHeaderValues>({
    schema: organisationCoreValuesHeaderSchema,
    formData,
    fileFields: ['coreValuesImage'],
    execute: async (data) => {
      const patch: Prisma.OrganizationUpdateInput = {};
      if (typeof data.coreValuesLeadText !== 'undefined') {
        patch.coreValuesLeadText = data.coreValuesLeadText;
      }
      if (typeof data.coreValuesImage !== 'undefined') {
        patch.coreValuesImage = jsonForPrisma(data.coreValuesImage ?? null);
      }

      await db.organization.update({ where: { id: orgId }, data: patch });
    },
    revalidateTags: [ORG_CORE_VALUES_HEADER_TAG],
    revalidatePaths: ['/dashboard/about/organization'],
  });
}
