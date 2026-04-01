// actions/about/content/team-messages.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';
import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { orgMessageSchema } from '@/lib/schemas/about/content/messages';
import type { ActionState } from '@/lib/types/action-state';
import type { OrgMessageFormValues } from '@/lib/types/about/content';
import { htmlToExcerpt } from '@/lib/text/excerpt';
import { ABOUT_MESSAGES_TAG, ABOUT_NAV_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE = '/dashboard/about/messages';

function finalExcerpt(excerpt: string | undefined | null, body: string): string {
  const trimmed = (excerpt ?? '').trim();
  return trimmed || htmlToExcerpt(body);
}

function toCreateData(data: OrgMessageFormValues): Prisma.OrganizationMessageCreateInput {
  return {
    title: data.title,
    excerpt: finalExcerpt(data.excerpt, data.body),
    body: data.body,
    authorTeam: { connect: { id: data.authorTeamId } },
    published: typeof data.published === 'boolean' ? data.published : true,
  };
}

function toUpdateData(data: OrgMessageFormValues): Prisma.OrganizationMessageUpdateInput {
  const patch: Prisma.OrganizationMessageUpdateInput = {
    title: data.title,
    body: data.body,
    excerpt: finalExcerpt(data.excerpt, data.body),
  };
  if (typeof data.published === 'boolean') {
    patch.published = data.published;
  }
  if (data.authorTeamId) {
    patch.authorTeam = { connect: { id: data.authorTeamId } };
  }
  return patch;
}

export const createOrgMessage = async (
  _p: ActionState<OrgMessageFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgMessageFormValues>({
    schema: orgMessageSchema,
    formData,
    booleanFields: ['published'],
    execute: async (data) => {
      await db.organizationMessage.create({ data: toCreateData(data) });
    },
    revalidate: REVALIDATE,
    revalidateTags: [ABOUT_MESSAGES_TAG, ABOUT_NAV_TAG],
  });
};

export const updateOrgMessage = async (
  id: string,
  _p: ActionState<OrgMessageFormValues>,
  formData: FormData,
) => {
  return executeAction<OrgMessageFormValues>({
    schema: orgMessageSchema,
    formData,
    booleanFields: ['published'],
    execute: async (data) => {
      await db.organizationMessage.update({ where: { id }, data: toUpdateData(data) });
    },
    revalidate: REVALIDATE,
    revalidateTags: [ABOUT_MESSAGES_TAG, ABOUT_NAV_TAG],
  });
};

export const deleteOrgMessage = async (id: string) => {
  await requireCurrentUser();
  await db.organizationMessage.delete({ where: { id } });
  revalidatePath(REVALIDATE);
  revalidateTag(ABOUT_MESSAGES_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
