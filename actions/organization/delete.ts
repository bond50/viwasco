// actions/organization/delete.ts
'use server';

import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ORG_ALL_TAGS } from '@/lib/cache/tags';
import { requireCurrentUser } from '@/lib/auth/auth-utils';

type DeleteOrganizationArgs = {
  id: string;
  confirmName: string;
};

export async function deleteOrganization({ id, confirmName }: DeleteOrganizationArgs) {
  // 🔐 AuthN + AuthZ
  const user = await requireCurrentUser(); // throws "Unauthorized" if not signed in
  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden'); // signed in but not allowed
  }

  // Validate input
  if (!id?.trim()) throw new Error('Missing organization id');
  if (!confirmName?.trim()) throw new Error('Missing confirmation');

  // Validate name before we mutate
  const org = await db.organization.findUnique({
    where: { id },
    select: { name: true },
  });
  if (!org) throw new Error('Organization not found');
  if (org.name.trim() !== confirmName.trim()) {
    throw new Error('Name confirmation does not match');
  }

  try {
    await db.organization.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') throw new Error('Organization not found');
      if (e.code === 'P2003')
        throw new Error('Cannot delete — organization has associated records');
    }
    throw e;
  }

  // Invalidate EVERYTHING org-related so UI flips to the Create card immediately
  for (const tag of ORG_ALL_TAGS) {
    revalidateTag(tag, 'max');
  }
  // And refresh key pages that might render cached shells
  revalidatePath('/dashboard/about');

  revalidatePath('/');
}
