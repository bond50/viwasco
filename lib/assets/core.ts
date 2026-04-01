// lib/assets/core.ts
import { z } from 'zod';
import { cloudinaryImageSchema, uploadedImageResponseSchema } from '@/lib/schemas/shared/image';
import { uploadedFileResponseSchema } from '@/lib/schemas/shared/file';
import { assetJsonSchema, uploadedAssetSchema } from '@/lib/schemas/shared/asset';
import { IMAGE_SIZES, type ImageSizeKey } from '@/lib/image-size';

type CloudinaryImage = z.infer<typeof cloudinaryImageSchema>;
type UploadedImageResponse = z.infer<typeof uploadedImageResponseSchema>;
type UploadedFileResponse = z.infer<typeof uploadedFileResponseSchema>;

export type UploadedAsset = z.infer<typeof uploadedAssetSchema>;
export type AssetJson = z.infer<typeof assetJsonSchema>;

/** Type guard: wrapped Cloudinary image */
export function isImageAsset(v: unknown): v is UploadedImageResponse {
  return uploadedImageResponseSchema.safeParse(v).success;
}

/** Type guard: Cloudinary file */
export function isFileAsset(v: unknown): v is UploadedFileResponse {
  return uploadedFileResponseSchema.safeParse(v).success;
}

/**
 * Normalize “maybe image JSON” into UploadedImageResponse or null.
 * Handles:
 *  - UploadedImageResponse
 *  - bare CloudinaryImage
 *  - JSON string of either
 */
export function ensureUploadedImage(input: unknown): UploadedImageResponse | null {
  if (input == null || input === '') return null;

  // Already in wrapped shape?
  if (isImageAsset(input)) return input;

  // JSON string?
  if (typeof input === 'string') {
    try {
      return ensureUploadedImage(JSON.parse(input));
    } catch {
      return null;
    }
  }

  // Single CloudinaryImage?
  const single = cloudinaryImageSchema.safeParse(input);
  if (single.success) {
    const img: CloudinaryImage = single.data;
    return { main: img, variants: {} };
  }

  return null;
}

export function ensureUploadedImageStrict(input: unknown): UploadedImageResponse {
  const img = ensureUploadedImage(input);
  if (!img) {
    throw new Error('Required image is missing or invalid (UploadedImageResponse expected).');
  }
  return img;
}

/**
 * Normalize “maybe asset JSON” into:
 *  - null                      → nothing to show
 *  - UploadedAsset             → image or file
 *  - UploadedAsset[]           → if an array was provided
 *
 * Handles:
 *  - UploadedImageResponse / UploadedFileResponse
 *  - arrays of those
 *  - JSON strings of single or array
 */
export function ensureUploadedAsset(input: unknown): AssetJson {
  if (input == null || input === '') return null;

  // Already array → normalize each element
  if (Array.isArray(input)) {
    const items = input
      .map((v) => ensureUploadedAsset(v))
      .flatMap((v) => (Array.isArray(v) ? v : v ? [v] : [])) as UploadedAsset[];
    return items.length ? items : null;
  }

  // Already a single asset?
  if (isImageAsset(input) || isFileAsset(input)) {
    return input as UploadedAsset;
  }

  // JSON string?
  if (typeof input === 'string') {
    try {
      return ensureUploadedAsset(JSON.parse(input));
    } catch {
      return null;
    }
  }

  // Last chance: trust the schema
  const parsed = uploadedAssetSchema.safeParse(input);
  if (parsed.success) return parsed.data;

  return null;
}

/**
 * Helper for UI defaults (FileDropzone, etc.):
 * convert arbitrary raw JSON / Prisma.JsonValue into something
 * the UI can consume, or `undefined` when empty/invalid.
 */
export function normalizeAssetDefault(raw: unknown): AssetJson | undefined {
  const asset = ensureUploadedAsset(raw);
  return asset ?? undefined;
}

/**
 * Pick the best Cloudinary variant based on IMAGE_SIZES.
 */
export function pickBestVariant(
  img: UploadedImageResponse,
  preferred: readonly ImageSizeKey[] = ['detail'] as unknown as readonly ImageSizeKey[],
): CloudinaryImage {
  const canonicalOrder: ImageSizeKey[] = Array.from(preferred).filter((k): k is ImageSizeKey =>
    Object.prototype.hasOwnProperty.call(IMAGE_SIZES, k),
  );

  const fallbackOrder: ImageSizeKey[] = [
    'hero',
    'cover',
    'wide',
    'banner',
    'xl',
    'large',
    'landscape',
    'content',
    'medium',
    'card',
    'small',
    'square',
    'avatar',
    'thumb',
    'original',
  ];

  const order = canonicalOrder.length ? canonicalOrder : fallbackOrder;

  for (const key of order) {
    const v = img.variants?.[key];
    if (v) return v;
  }

  const all = Object.values(img.variants ?? {});
  if (all.length) {
    return all.reduce((best, cur) => ((cur.width ?? 0) > (best.width ?? 0) ? cur : best), all[0]);
  }

  return img.main;
}

/** Convenience: get secure_url (or url) of best match; undefined if missing. */
export function getBestImageUrl(
  img: UploadedImageResponse | null | undefined,
  preferred?: readonly ImageSizeKey[],
): string | undefined {
  if (!img) return undefined;
  const best = pickBestVariant(img, preferred);
  return best.secure_url || best.url;
}

/**
 * Get a URL that you can use in <img> or <a> regardless of asset type.
 * Images → best variant URL
 * Files  → secure_url / url
 * Arrays → first element
 */
export function assetUrl(
  asset: AssetJson,
  preferredSizes?: readonly ImageSizeKey[],
): string | undefined {
  if (!asset) return undefined;

  if (Array.isArray(asset)) {
    const first = asset[0];
    return first ? assetUrl(first, preferredSizes) : undefined;
  }

  if (isImageAsset(asset)) return getBestImageUrl(asset, preferredSizes);

  if (isFileAsset(asset)) return asset.secure_url || asset.url;

  return undefined;
}
