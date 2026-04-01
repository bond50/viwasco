// lib/public/media.ts
import { ensureUploadedImage, getBestImageUrl } from '@/lib/assets/core';
import type { ImageSizeKey } from '@/lib/image-size';

/** Human-friendly date formatter (you can tweak locale/options) */
export function formatDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Public helper for getting an <img src> from any JSON-ish field.
 *
 * Usage:
 *   const src = pickImageUrl(row.image);
 *   if (src) <img src={src} ... />
 */
export function pickImageUrl(
  raw: unknown,
  preferred?: readonly ImageSizeKey[],
): string | null {
  const img = ensureUploadedImage(raw);
  return getBestImageUrl(img, preferred) ?? null;
}
