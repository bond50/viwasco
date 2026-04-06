import { type UploadedImageResponse, uploadedImageResponseSchema } from '@/lib/schemas/shared/image';
import { ABOUT_NAV_TAG, SERVICES_TAG } from '@/lib/cache/tags';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import { failSoftPublicQuery } from '@/lib/data/public/failsafe';

export type PublicServiceCard = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  heroImage: UploadedImageResponse | null;
};

export type PublicServiceDetail = PublicServiceCard & {
  bodyHtml: string;
};

function toUploadedImage(value: unknown): UploadedImageResponse | null {
  const parsed = uploadedImageResponseSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function extractServiceHtml(content: unknown): string {
  if (
    content &&
    typeof content === 'object' &&
    !Array.isArray(content) &&
    'html' in content
  ) {
    const html = (content as { html?: unknown }).html;
    return typeof html === 'string' ? html : '';
  }

  if (typeof content === 'string') {
    return content;
  }

  return '';
}

export async function getServices(): Promise<PublicServiceCard[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(SERVICES_TAG);
  cacheTag(ABOUT_NAV_TAG);

  const rows = await failSoftPublicQuery(
    db.service.findMany({
      where: {
        deleted_at: null,
        is_active: true,
        is_public: true,
      },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        image: true,
      },
    }),
    { label: 'getServices', fallback: [] },
  );

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.title,
    summary: row.excerpt?.trim() || '',
    heroImage: toUploadedImage(row.image),
  }));
}

export async function getServiceBySlug(
  slug: string,
): Promise<PublicServiceDetail | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag(SERVICES_TAG);
  cacheTag(ABOUT_NAV_TAG);

  const row = await db.service.findFirst({
    where: {
      slug,
      deleted_at: null,
      is_active: true,
      is_public: true,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      image: true,
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.title,
    summary: row.excerpt?.trim() || '',
    bodyHtml: extractServiceHtml(row.content),
    heroImage: toUploadedImage(row.image),
  };
}
