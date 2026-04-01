// actions/about/content/partners.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { executeAction } from '@/lib/actions/execute-action';
import { jsonForPrisma } from '@/lib/actions/json-helpers';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { type PartnerFormValues, partnerSchema } from '@/lib/schemas/about/content/partners';
import type { ActionState } from '@/lib/types/action-state';
import { bulkReorder, getNextRank, reorderAfterDelete } from '@/lib/ranking';
import { ABOUT_NAV_TAG, ABOUT_PARTNERS_TAG } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

const REVALIDATE_DASHBOARD = '/dashboard/about/partners';

async function nextUniqueSlugFromName(name: string) {
  const root = slugify(name);
  return uniqueSlug(root, async (candidate) => {
    const hit = await db.partner.findUnique({ where: { slug: candidate }, select: { id: true } });
    return Boolean(hit);
  });
}

function toCreateData(
  data: PartnerFormValues & { slug: string },
  nextRank: number,
): Prisma.PartnerCreateInput {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description?.trim() || null,
    website: data.website,
    partnershipType: data.partnershipType,
    logo: jsonForPrisma(data.logo ?? null),
    rank: nextRank,
    isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
  };
}

function toUpdateData(data: PartnerFormValues): Prisma.PartnerUpdateInput {
  const patch: Prisma.PartnerUpdateInput = {
    name: data.name,
    description: data.description?.trim() || null,
    website: data.website,
    partnershipType: data.partnershipType,
  };

  if (typeof data.logo !== 'undefined') patch.logo = jsonForPrisma(data.logo ?? null);
  if (typeof data.rank === 'number') patch.rank = data.rank;
  if (typeof data.isActive === 'boolean') patch.isActive = data.isActive;
  if (data.slug && data.slug.trim()) patch.slug = data.slug.trim();

  return patch;
}

export const createPartner = async (_prev: ActionState<PartnerFormValues>, formData: FormData) => {
  return executeAction<PartnerFormValues>({
    schema: partnerSchema,
    formData,
    fileFields: ['logo'],
    numberFields: ['rank'],
    booleanFields: ['isActive'],
    execute: async (data) => {
      const nextRank = typeof data.rank === 'number' ? data.rank : await getNextRank('partner');

      const ensuredSlug = (data.slug?.trim() || null) ?? (await nextUniqueSlugFromName(data.name));

      await db.partner.create({
        data: toCreateData({ ...data, slug: ensuredSlug }, nextRank),
      });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_PARTNERS_TAG, ABOUT_NAV_TAG],
  });
};

export const updatePartner = async (
  id: string,
  _prev: ActionState<PartnerFormValues>,
  formData: FormData,
) => {
  return executeAction<PartnerFormValues>({
    schema: partnerSchema,
    formData,
    fileFields: ['logo'],
    numberFields: ['rank'],
    booleanFields: ['isActive'],
    execute: async (data) => {
      await db.partner.update({ where: { id }, data: toUpdateData(data) });
    },
    revalidate: REVALIDATE_DASHBOARD,
    revalidateTags: [ABOUT_PARTNERS_TAG, ABOUT_NAV_TAG],
  });
};

export const deletePartner = async (id: string) => {
  await requireCurrentUser();

  const row = await db.partner.findUnique({ where: { id }, select: { rank: true } });
  if (!row) return;

  await db.partner.delete({ where: { id } });

  if (typeof row.rank === 'number') {
    await reorderAfterDelete('partner', {}, row.rank);
  }
  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_PARTNERS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};

export const reorderPartners = async (updates: { id: string; rank: number }[]) => {
  await requireCurrentUser();

  await bulkReorder('partner', {}, updates);
  revalidatePath(REVALIDATE_DASHBOARD);
  revalidateTag(ABOUT_PARTNERS_TAG, 'max');
  revalidateTag(ABOUT_NAV_TAG, 'max');
};
