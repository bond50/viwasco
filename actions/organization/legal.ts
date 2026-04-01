// actions/organization/legal.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { processDateField } from '@/lib/process-date-field';
import type { ActionState } from '@/lib/types/action-state';
import {
  organisationLegalSchema,
  type OrganisationLegalValues,
} from '@/lib/schemas/about/organization/legal';
import { ORG_LEGAL_TAG } from '@/lib/cache/tags';

export async function updateOrganizationLegal(
  orgId: string,
  _prev: ActionState<OrganisationLegalValues>,
  formData: FormData,
) {
  if (!orgId) throw new Error('Missing organization id.');

  return executeAction<OrganisationLegalValues>({
    schema: organisationLegalSchema,
    formData,
    dateFields: ['licenseExpiry'],
    execute: async (data) => {
      const patch: Prisma.OrganizationUpdateInput = {};
      if (typeof data.regulatorName !== 'undefined') {
        patch.regulatorName = data.regulatorName;
      }
      if (typeof data.licenseNumber !== 'undefined') {
        patch.licenseNumber = data.licenseNumber;
      }
      if (typeof data.licenseExpiry !== 'undefined') {
        patch.licenseExpiry = processDateField(data.licenseExpiry ?? null);
      }
      if (typeof data.customerCareHotline !== 'undefined') {
        patch.customerCareHotline = data.customerCareHotline;
      }
      if (typeof data.whatsappNumber !== 'undefined') {
        patch.whatsappNumber = data.whatsappNumber;
      }

      await db.organization.update({ where: { id: orgId }, data: patch });
    },
    revalidateTags: [ORG_LEGAL_TAG],
    revalidatePaths: ['/dashboard/about/organization'],
  });
}
