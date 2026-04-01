'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';

import { jsonForPrismaRequired } from '@/lib/actions/json-helpers';
import type { ActionState } from '@/lib/types/action-state';
import {
  adminAccessSchema,
  type AdminAccessValues,
} from '@/lib/schemas/about/organization/admin-access';
import { executeAction } from '@/lib/actions/execute-action';
import { ORG_ADMIN_ACCESS_TAG } from '@/lib/cache/tags';

function uniqLower(emails: string[] = []): string[] {
  const set = new Set(emails.map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0));
  return Array.from(set).sort();
}

export async function updateOrganizationAdminAccess(
  orgId: string,
  _prev: ActionState<AdminAccessValues>,
  formData: FormData,
) {
  if (!orgId) {
    return { success: false, errors: { _form: ['Missing organization id.'] } };
  }

  return executeAction<AdminAccessValues>({
    schema: adminAccessSchema,
    formData,
    jsonFields: ['emails'],
    booleanFields: ['bootstrap'],

    execute: async (data) => {
      const emails = uniqLower(data.emails ?? []);
      const patch: Prisma.OrganizationUpdateInput = {
        adminAllowlist: jsonForPrismaRequired(emails),
        adminBootstrap: data.bootstrap ?? false,
      };

      await db.organization.update({ where: { id: orgId }, data: patch });
    },

    // ✅ Only revalidate this section’s tag
    revalidateTags: [ORG_ADMIN_ACCESS_TAG],
    revalidatePaths: ['/dashboard/about/organization'],
  });
}
