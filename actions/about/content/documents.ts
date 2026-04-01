'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrismaRequired } from '@/lib/actions/json-helpers';
import { OrgDocumentFormValues, orgDocumentSchema } from '@/lib/schemas/about/content/documents';
import type { ActionState } from '@/lib/types/action-state';

import { bulkReorder, getNextRank, reorderAfterDelete } from '@/lib/ranking';
import { ABOUT_DOC_CATS_TAG, ABOUT_DOCS_TAG, ABOUT_NAV_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';
import { uniqueSlug } from '@/lib/slugify';

const REVALIDATE_DASHBOARD = '/dashboard/about/documents';

async function buildCreateData(
  data: OrgDocumentFormValues,
): Promise<Prisma.OrganizationDocumentCreateInput> {
  const rank = await getNextRank('organizationDocument');

  const slug = await uniqueSlug(
    data.title,
    async (candidate) =>
      !!(await db.organizationDocument.findFirst({
        where: { slug: candidate },
        select: { id: true },
      })),
  );

  return {
    title: data.title,
    slug,
    description: data.description ?? null,
    file: jsonForPrismaRequired(data.file),
    published: data.published ?? true,
    rank,
    category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
  };
}

function buildUpdateData(data: OrgDocumentFormValues): Prisma.OrganizationDocumentUpdateInput {
  const base: Prisma.OrganizationDocumentUpdateInput = {
    title: data.title,
    description: data.description ?? null,
    published: data.published ?? true,
  };

  // NOTE: slug + rank are *not* editable here (slug is stable; rank via RankedList).
  if (typeof data.categoryId === 'string' && data.categoryId.length > 0) {
    base.category = { connect: { id: data.categoryId } };
  }
  if (data.categoryId === null) {
    base.category = { disconnect: true };
  }

  if (typeof data.file !== 'undefined') {
    base.file = jsonForPrismaRequired(data.file);
  }

  return base;
}

export const createOrgDocument = async (
  _prev: ActionState<OrgDocumentFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgDocumentFormValues>({
    schema: orgDocumentSchema,
    formData,
    booleanFields: ['published'],
    fileFields: ['file'],
    execute: async (data) => {
      const createData = await buildCreateData(data);
      await db.organizationDocument.create({ data: createData });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_DOCS_TAG, ABOUT_DOC_CATS_TAG, ABOUT_NAV_TAG],
  });
};

export const updateOrgDocument = async (
  id: string,
  _prev: ActionState<OrgDocumentFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgDocumentFormValues>({
    schema: orgDocumentSchema,
    formData,
    booleanFields: ['published'],
    fileFields: ['file'],
    execute: async (data) => {
      await db.organizationDocument.update({
        where: { id },
        data: buildUpdateData(data),
      });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_DOCS_TAG, ABOUT_DOC_CATS_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteOrgDocument = async (id: string) => {
  await requireCurrentUser();

  const row = await db.organizationDocument.findUnique({
    where: { id },
    select: { rank: true },
  });
  if (!row) return;

  await db.organizationDocument.delete({ where: { id } });

  if (typeof row.rank === 'number') {
    await reorderAfterDelete('organizationDocument', {}, row.rank);
  }

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_DOCS_TAG, 'max');
  revalidateTag(ABOUT_DOC_CATS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderOrgDocuments = async (updates: { id: string; rank: number }[]) => {
  await requireCurrentUser();
  await bulkReorder('organizationDocument', {}, updates);

  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_DOCS_TAG, 'max');
  revalidateTag(ABOUT_DOC_CATS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
