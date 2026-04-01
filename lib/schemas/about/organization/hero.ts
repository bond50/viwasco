// lib/schemas/about/organization/hero.ts
import { z } from 'zod';

export const HERO_VARIANTS = ['compact', 'normal', 'tall', 'full'] as const;
export const HERO_CONTENT_MODES = ['single', 'carousel', 'swiper'] as const;

// New granular enums
export const HERO_TEXT_ALIGNS = ['left', 'center'] as const;
export const HERO_TEXT_CHROMES = ['plain', 'liquid', 'boxed', 'shadow'] as const;
export const HERO_OVERLAY_STRENGTHS = ['none', 'soft', 'medium', 'strong'] as const;

const optionalTrimmedUrl = z
  .string()
  .trim()
  .max(2048)
  .optional()
  .transform((v) => {
    if (!v || v.length === 0) return undefined;
    return v;
  });

export const organizationHeroSchema = z.object({
  // Global toggles
  enabled: z.boolean().optional(),
  variant: z.enum(HERO_VARIANTS).default('normal'),
  contentMode: z.enum(HERO_CONTENT_MODES).default('single'),

  // Desktop config
  desktopShow: z.boolean().optional(),
  desktopUseVideo: z.boolean().optional(),
  desktopTextAlign: z.enum(HERO_TEXT_ALIGNS).optional(),
  desktopTextChrome: z.enum(HERO_TEXT_CHROMES).optional(),
  desktopShowScrollCue: z.boolean().optional(),
  desktopOverlayStrength: z.enum(HERO_OVERLAY_STRENGTHS).optional(),

  // Mobile config
  mobileShow: z.boolean().optional(),
  mobileUseVideo: z.boolean().optional(),
  mobileTextAlign: z.enum(HERO_TEXT_ALIGNS).optional(),
  mobileTextChrome: z.enum(HERO_TEXT_CHROMES).optional(),
  mobileShowScrollCue: z.boolean().optional(),
  mobileOverlayStrength: z.enum(HERO_OVERLAY_STRENGTHS).optional(),

  // Media URLs
  videoSrc: optionalTrimmedUrl,
  mobileSrc: optionalTrimmedUrl,
  poster: optionalTrimmedUrl,
});

export type OrganizationHeroValues = z.infer<typeof organizationHeroSchema>;
