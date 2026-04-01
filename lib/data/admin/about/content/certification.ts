// lib/data/admin/about/content/certification.ts
import 'server-only';
import { db } from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ABOUT_CERTS_TAG } from '@/lib/cache/tags';
import type { Prisma } from '@/generated/prisma/client';

export type AdminCertificationRow = {
  id: string;
  name: string;
  issuingAuthority: string | null;
  issueDate: Date | null;
  expiryDate: Date | null;
  certificateFile: Prisma.JsonValue | null;
  rank: number;
};

export const listCertifications = async (): Promise<AdminCertificationRow[]> => {
  return db.organizationCertification.findMany({
    orderBy: [{ rank: 'asc' }, { issueDate: 'asc' }],
    select: {
      id: true,
      name: true,
      issuingAuthority: true,
      issueDate: true,
      expiryDate: true,
      certificateFile: true,
      rank: true,
    },
  });
};

export const getCertificationById = async (id: string): Promise<AdminCertificationRow | null> => {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_CERTS_TAG);

  return db.organizationCertification.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      issuingAuthority: true,
      issueDate: true,
      expiryDate: true,
      certificateFile: true,
      rank: true,
    },
  });
};
