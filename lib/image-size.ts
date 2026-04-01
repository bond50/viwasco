// lib/image-size.ts
import { z } from 'zod';

/**
 * Single source of truth for image sizes.
 * No aliases (sm/md/lg) — only canonical keys.
 */
export const IMAGE_SIZES = {
  thumb: { width: 150, height: 150 },
  avatar: { width: 200, height: 200 },
  square: { width: 600, height: 600 },
  card: { width: 800, height: 450 },

  small: { width: 640, height: 420 },
  medium: { width: 960, height: 640 },
  large: { width: 1200, height: 800 },
  xl: { width: 1600, height: 900 },

  banner: { width: 1600, height: 400 },
  hero: { width: 1600, height: 900 },
  cover: { width: 1920, height: 640 },
  wide: { width: 1920, height: 800 },
  poster: { width: 1200, height: 1600 },
  landscape: { width: 1600, height: 1000 },

  content: { width: 1920, height: null },
  original: { width: null, height: null },
} as const;

export type ImageSizeKey = keyof typeof IMAGE_SIZES;

export const imageSizeKeySchema = z.enum(
  Object.keys(IMAGE_SIZES) as [ImageSizeKey, ...ImageSizeKey[]],
);
