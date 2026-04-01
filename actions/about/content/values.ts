// actions/about/content/core-values.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import {
  type OrgCoreValuesSaveInput,
  orgCoreValuesSaveSchema,
} from '@/lib/schemas/about/content/values';
import type { ActionState } from '@/lib/types/action-state';
import { ABOUT_NAV_TAG, ABOUT_VALUES_TAG, ORG_CORE_VALUES_HEADER_TAG } from '@/lib/cache/tags';

export const saveOrgCoreValues = async (
  _prev: ActionState<OrgCoreValuesSaveInput>,
  formData: FormData,
) => {
  return executeAction<OrgCoreValuesSaveInput>({
    schema: orgCoreValuesSaveSchema,
    formData,
    jsonFields: ['coreValues', 'coreValuesImage'],
    execute: async (data) => {
      // ensure org row (single-org app)
      const org = await db.organization.findFirst({ select: { id: true } });
      const orgId =
        org?.id ??
        (
          await db.organization.create({
            data: {
              name: 'Organization',
              slug: 'organization',
              coreValuesLeadText: data.coreValuesLeadText ?? null,
              coreValuesImage: jsonForPrisma(data.coreValuesImage ?? null),
              logo: Prisma.JsonNull,
              featuredImage: Prisma.JsonNull,
            },
            select: { id: true },
          })
        ).id;

      // update org fields
      await db.organization.update({
        where: { id: orgId },
        data: {
          coreValuesLeadText: data.coreValuesLeadText ?? null,
          coreValuesImage: jsonForPrisma(data.coreValuesImage ?? null),
        },
      });

      // sync OrganizationValue rows (ranked)
      const incoming = data.coreValues;
      const normalized = incoming
        .slice()
        .sort((a, b) => a.rank - b.rank)
        .map((v, i) => ({ ...v, rank: i + 1 }));

      const existing = await db.organizationValue.findMany({ select: { id: true } });
      const existingIds = new Set(existing.map((e) => e.id));
      const incomingIds = new Set(normalized.map((v) => v.id));

      const toCreate = normalized.filter((v) => !existingIds.has(v.id));
      const toUpdate = normalized.filter((v) => existingIds.has(v.id));
      const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));

      await db.$transaction(async (tx) => {
        if (toDelete.length) {
          await tx.organizationValue.deleteMany({ where: { id: { in: toDelete } } });
        }
        for (const v of toUpdate) {
          await tx.organizationValue.update({
            where: { id: v.id },
            data: {
              title: v.title,
              description: v.description,
              icon: v.icon ?? null,
              rank: v.rank,
            },
          });
        }
        for (const v of toCreate) {
          await tx.organizationValue.create({
            data: {
              title: v.title,
              description: v.description,
              icon: v.icon ?? null,
              rank: v.rank,
            },
          });
        }
      });
    },
    // Orchestrator will handle page + tag revalidation
    revalidatePaths: ['/dashboard/about/core-values', '/dashboard/about/organization'],
    revalidateTags: [ABOUT_VALUES_TAG, ORG_CORE_VALUES_HEADER_TAG, ABOUT_NAV_TAG],
  });
};
