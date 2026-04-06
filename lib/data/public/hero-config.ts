// lib/data/public/hero-config.ts
import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import { ABOUT_NAV_TAG, ORG_HERO_TAG } from '@/lib/cache/tags';
import { failSoftPublicQuery } from '@/lib/data/public/failsafe';

// === Base types (v2 – no legacy) ===========================================

export type HeroVariant = 'compact' | 'normal' | 'tall' | 'full';
export type HeroContentMode = 'single' | 'carousel' | 'swiper';
export type HeroTextAlign = 'left' | 'center';
export type HeroTextChrome = 'plain' | 'liquid' | 'boxed' | 'shadow';
export type HeroOverlayStrength = 'none' | 'soft' | 'medium' | 'strong';

type UploadedImage = { url?: string | null } | null | undefined;

const HERO_SUBHEADING_FALLBACK =
  'Access clean water services, customer support, and service updates from one place. Find what you need quickly, from billing tools to contact information and project news.';
const HERO_KICKER_FALLBACK = 'Serving Vihiga County';

export type ResolvedHeroDeviceConfig = {
  show: boolean;
  useVideo: boolean;
  textAlign: HeroTextAlign;
  textChrome: HeroTextChrome;
  showScrollCue: boolean;
  overlayStrength: HeroOverlayStrength;
};

export type HeroSlide = {
  id: string;
  kicker: string | null;
  heading: string;
  subheading: string | null;
};

export type ResolvedHeroConfig = {
  enabled: boolean;
  variant: HeroVariant;
  contentMode: HeroContentMode;

  desktop: ResolvedHeroDeviceConfig;
  mobile: ResolvedHeroDeviceConfig;

  kicker: string | null;
  heading: string;
  subheading: string | null;

  video: {
    src: string | null;
    mobile: string | null;
    poster: string | null;
  } | null;

  image: {
    src: string;
  };

  /**
   * Generic text slides for swiper/carousel modes.
   * Sliding is only enabled when slides.length >= 2.
   */
  slides: HeroSlide[];
};

// === Helpers ================================================================

function imgUrl(x: UploadedImage): string | null {
  if (!x || typeof x !== 'object') return null;
  if ('url' in x && typeof x.url === 'string') return x.url;
  return null;
}

function normalizeHeroSubheading(raw: string | null | undefined): string | null {
  return HERO_SUBHEADING_FALLBACK;
}

function normalizeHeroKicker(raw: string | null | undefined): string | null {
  const text = raw?.trim();
  if (!text) return HERO_KICKER_FALLBACK;

  const lower = text.toLowerCase();
  if (lower.includes('lorem ipsum') || lower.includes('water is life we care')) {
    return HERO_KICKER_FALLBACK;
  }

  return text;
}

function normalizeVariant(raw: unknown): HeroVariant {
  if (raw === 'compact' || raw === 'tall' || raw === 'full') {
    return raw;
  }
  return 'normal';
}

function normalizeContentMode(raw: unknown): HeroContentMode {
  if (raw === 'single' || raw === 'carousel' || raw === 'swiper') {
    return raw;
  }
  return 'single';
}

function normalizeTextAlign(raw: unknown): HeroTextAlign {
  if (raw === 'left' || raw === 'center') return raw;
  return 'left';
}

function normalizeTextChrome(raw: unknown): HeroTextChrome {
  if (raw === 'plain' || raw === 'liquid' || raw === 'boxed' || raw === 'shadow') {
    return raw;
  }
  return 'plain';
}

function normalizeOverlayStrength(raw: unknown): HeroOverlayStrength {
  if (raw === 'none' || raw === 'soft' || raw === 'medium' || raw === 'strong') {
    return raw;
  }
  return 'medium';
}

function normalizeDevice(
  raw: unknown,
  defaults: {
    show: boolean;
    useVideo: boolean;
    textAlign: HeroTextAlign;
    textChrome: HeroTextChrome;
    showScrollCue: boolean;
    overlayStrength: HeroOverlayStrength;
  },
): ResolvedHeroDeviceConfig {
  if (!raw || typeof raw !== 'object') {
    return defaults;
  }

  const obj = raw as Record<string, unknown>;

  return {
    show:
      typeof obj.show === 'boolean'
        ? obj.show
        : defaults.show,
    useVideo:
      typeof obj.useVideo === 'boolean'
        ? obj.useVideo
        : defaults.useVideo,
    textAlign: normalizeTextAlign(obj.textAlign ?? defaults.textAlign),
    textChrome: normalizeTextChrome(obj.textChrome ?? defaults.textChrome),
    showScrollCue:
      typeof obj.showScrollCue === 'boolean'
        ? obj.showScrollCue
        : defaults.showScrollCue,
    overlayStrength: normalizeOverlayStrength(
      obj.overlayStrength ?? defaults.overlayStrength,
    ),
  };
}

// === Main fetch =============================================================

export async function fetchHeroConfig(): Promise<ResolvedHeroConfig | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(ORG_HERO_TAG);
  cacheTag(ABOUT_NAV_TAG);

  const row = await failSoftPublicQuery(
    db.organization.findFirst({
      select: {
        name: true,
        introTitle: true,
        tagline: true,
        introDescription: true,
        featuredImage: true,
        metadata: true,
      },
    }),
    { label: 'fetchHeroConfig', fallback: null },
  );

  if (!row) return null;

  // --- Text mapping: matches your admin text mapping guide ------------------
  const heading = row.introTitle ?? row.name ?? 'Welcome';
  const subheading = normalizeHeroSubheading(row.introDescription);
  const kicker = normalizeHeroKicker(row.tagline);

  const metaObj = (row.metadata ?? {}) as Record<string, unknown>;
  const heroRaw = (metaObj.hero ?? {}) as Record<string, unknown>;

  const enabled =
    typeof heroRaw.enabled === 'boolean' ? heroRaw.enabled : true;

  const variant = normalizeVariant(heroRaw.variant);
  const contentMode = normalizeContentMode(heroRaw.contentMode);

  const videoSrc =
    typeof heroRaw.videoSrc === 'string' || heroRaw.videoSrc === null
      ? (heroRaw.videoSrc as string | null)
      : null;

  const mobileSrc =
    typeof heroRaw.mobileSrc === 'string' || heroRaw.mobileSrc === null
      ? (heroRaw.mobileSrc as string | null)
      : null;

  const poster =
    typeof heroRaw.poster === 'string' || heroRaw.poster === null
      ? (heroRaw.poster as string | null)
      : null;

  // --- Image: featuredImage JSON with strict fallback -----------------------
  const rawImageSrc = imgUrl(row.featuredImage as UploadedImage);
  const fallbackImageSrc = rawImageSrc ?? '/assets/img/featured-default.jpg';

  // Per-device config — opinionated defaults baked in
  const desktop = normalizeDevice(heroRaw.desktop, {
    show: true,
    useVideo: true,
    textAlign: 'left',
    textChrome: 'plain',
    showScrollCue: true,
    overlayStrength: 'medium',
  });

  const mobile = normalizeDevice(heroRaw.mobile, {
    show: true,
    useVideo: false,
    textAlign: 'center',
    textChrome: 'plain',
    showScrollCue: true,
    overlayStrength: 'soft',
  });

  // For now, slides = single main slide based on your text mapping.
  // Later, backend can store an array (metadata.hero.slides) and we can swap this.
  const slides: HeroSlide[] = [
    {
      id: 'main',
      kicker,
      heading,
      subheading,
    },
  ];

  return {
    enabled,
    variant,
    contentMode,
    desktop,
    mobile,
    kicker,
    heading,
    subheading,
    video:
      videoSrc || mobileSrc || poster
        ? {
            src: videoSrc,
            mobile: mobileSrc,
            poster,
          }
        : null,
    image: {
      src: fallbackImageSrc,
    },
    slides,
  };
}
