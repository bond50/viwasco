// lib/data/admin/about/content/testimonials.ts
import 'server-only';
import { db } from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ABOUT_TESTIMONIALS_TAG } from '@/lib/cache/tags';
import { Prisma } from '@/generated/prisma/client';

export type AdminTestimonialRow = {
  id: string;
  authorName: string;
  authorRole: string | null;
  message: string;
  avatar: Prisma.JsonValue | null;
  published: boolean;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function listTestimonials(): Promise<AdminTestimonialRow[]> {
  return db.organizationTestimonial.findMany({
    orderBy: { rank: 'asc' },
    select: {
      id: true,
      authorName: true,
      authorRole: true,
      message: true,
      avatar: true,
      published: true,
      rank: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getTestimonialById(id: string): Promise<AdminTestimonialRow | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_TESTIMONIALS_TAG);

  return db.organizationTestimonial.findUnique({
    where: { id },
    select: {
      id: true,
      authorName: true,
      authorRole: true,
      message: true,
      avatar: true,
      published: true,
      rank: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
