// actions/about/content/certifications.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import { orgCertificationSchema } from '@/lib/schemas/about/content/certifications';
import type { ActionState } from '@/lib/types/action-state';
import type { OrgCertificationFormValues } from '@/lib/types/about/content';
import { bulkReorder, getNextRank, reorderAfterDelete } from '@/lib/ranking';
import { ABOUT_CERTS_TAG, ABOUT_NAV_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/about/certifications';

function toCreateData(
  data: OrgCertificationFormValues,
  nextRank: number,
): Prisma.OrganizationCertificationCreateInput {
  return {
    name: data.name,
    issuingAuthority: data.issuingAuthority ?? null,
    issueDate: data.issueDate ?? null,
    expiryDate: data.expiryDate ?? null,
    certificateFile: jsonForPrisma(data.certificateFile ?? null),
    rank: nextRank,
  };
}

function toUpdateData(
  data: OrgCertificationFormValues,
): Prisma.OrganizationCertificationUpdateInput {
  const base: Prisma.OrganizationCertificationUpdateInput = {
    name: data.name,
    issuingAuthority: data.issuingAuthority ?? null,
    issueDate: data.issueDate ?? null,
    expiryDate: data.expiryDate ?? null,
  };
  if (typeof data.certificateFile !== 'undefined') {
    base.certificateFile = jsonForPrisma(data.certificateFile ?? null);
  }
  if (typeof data.rank === 'number') base.rank = data.rank;
  return base;
}

export const createOrgCertification = async (
  _prev: ActionState<OrgCertificationFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgCertificationFormValues>({
    schema: orgCertificationSchema,
    formData,
    fileFields: ['certificateFile'],
    dateFields: ['issueDate', 'expiryDate'],
    numberFields: ['rank'],
    execute: async (data) => {
      const nextRank =
        typeof data.rank === 'number' ? data.rank : await getNextRank('organizationCertification');
      await db.organizationCertification.create({
        data: toCreateData(data, nextRank),
      });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_CERTS_TAG, ABOUT_NAV_TAG],
  });
};

export const updateOrgCertification = async (
  id: string,
  _prev: ActionState<OrgCertificationFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgCertificationFormValues>({
    schema: orgCertificationSchema,
    formData,
    fileFields: ['certificateFile'],
    dateFields: ['issueDate', 'expiryDate'],
    numberFields: ['rank'],
    execute: async (data) => {
      await db.organizationCertification.update({
        where: { id },
        data: toUpdateData(data),
      });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_CERTS_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteOrgCertification = async (id: string) => {
  await requireCurrentUser();

  const row = await db.organizationCertification.findUnique({
    where: { id },
    select: { rank: true },
  });
  if (!row) return;

  await db.organizationCertification.delete({ where: { id } });
  if (typeof row.rank === 'number') {
    await reorderAfterDelete('organizationCertification', {}, row.rank);
  }
  revalidatePath(REVALIDATE_DASHBOARD);
  revalidatePath('/about/certifications');
  revalidateTag(ABOUT_CERTS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderOrgCertifications = async (updates: { id: string; rank: number }[]) => {
  await requireCurrentUser();
  await bulkReorder('organizationCertification', {}, updates);
  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_CERTS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
  revalidatePath('/about/certifications');
};
