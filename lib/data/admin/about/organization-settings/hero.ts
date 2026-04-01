// lib/data/admin/about/organization-settings/hero.ts
import 'server-only';
import { db } from '@/lib/db';
import type { HeroDeviceState, OrganizationSettingsData } from '@/lib/types/about';

export type OrgHero = OrganizationSettingsData['homepageHero'];

type OrgTextSource = {
  name: string | null;
  introTitle: string | null;
  tagline: string | null;
  introDescription: string | null;
};

const DESKTOP_DEFAULT: HeroDeviceState = {
  show: true,
  useVideo: true,
  textAlign: 'left',
  textChrome: 'plain',
  showScrollCue: true,
  overlayStrength: 'medium',
};

const MOBILE_DEFAULT: HeroDeviceState = {
  show: true,
  useVideo: false,
  textAlign: 'center',
  textChrome: 'plain',
  showScrollCue: true,
  overlayStrength: 'soft',
};

function normalizeDevice(raw: unknown, defaults: HeroDeviceState): HeroDeviceState {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  // Only used for boolean keys, so type the key accordingly
  const bool = (key: 'show' | 'useVideo' | 'showScrollCue'): boolean => {
    const v = obj[key as string];
    return typeof v === 'boolean' ? v : (defaults[key] as boolean);
  };

  const strEnum = <K extends keyof HeroDeviceState>(
    key: K,
    allowed: readonly HeroDeviceState[K][],
  ): HeroDeviceState[K] => {
    const v = obj[key as string];
    if (typeof v === 'string' && (allowed as readonly string[]).includes(v as string)) {
      return v as HeroDeviceState[K];
    }
    return defaults[key];
  };

  return {
    show: bool('show'),
    useVideo: bool('useVideo'),
    textAlign: strEnum('textAlign', ['left', 'center']),
    textChrome: strEnum('textChrome', ['plain', 'liquid', 'boxed', 'shadow']),
    showScrollCue: bool('showScrollCue'),
    overlayStrength: strEnum('overlayStrength', ['none', 'soft', 'medium', 'strong']),
  };
}

function coerceHeroFromMeta(meta: unknown, org: OrgTextSource): OrgHero {
  const metaObj = (meta ?? {}) as Record<string, unknown>;
  const heroRaw = (metaObj.hero ?? {}) as Record<string, unknown>;

  const heading = org.introTitle ?? org.name ?? 'Welcome';
  const subheading = org.introDescription ?? null;
  const kicker = org.tagline ?? null;

  const enabled = typeof heroRaw.enabled === 'boolean' ? (heroRaw.enabled as boolean) : true;

  const variantRaw = heroRaw.variant;
  const variant: OrgHero['variant'] =
    variantRaw === 'compact' ||
    variantRaw === 'normal' ||
    variantRaw === 'tall' ||
    variantRaw === 'full'
      ? (variantRaw as OrgHero['variant'])
      : 'normal';

  const contentModeRaw = heroRaw.contentMode;
  const contentMode: OrgHero['contentMode'] =
    contentModeRaw === 'carousel' || contentModeRaw === 'swiper' || contentModeRaw === 'single'
      ? (contentModeRaw as OrgHero['contentMode'])
      : 'single';

  const strOrNull = (v: unknown): string | null =>
    typeof v === 'string' && v.trim().length > 0 ? v : null;

  const desktop = normalizeDevice(heroRaw.desktop, DESKTOP_DEFAULT);
  const mobile = normalizeDevice(heroRaw.mobile, MOBILE_DEFAULT);

  return {
    enabled,
    variant,
    contentMode,
    desktop,
    mobile,
    kicker,
    heading,
    subheading,
    videoSrc: strOrNull(heroRaw.videoSrc),
    mobileSrc: strOrNull(heroRaw.mobileSrc),
    poster: strOrNull(heroRaw.poster),
  };
}

export async function getOrgHero(): Promise<OrgHero | null> {
  const row = await db.organization.findFirst({
    select: {
      name: true,
      introTitle: true,
      tagline: true,
      introDescription: true,
      metadata: true,
    },
  });

  if (!row) return null;

  // If hero is missing, return null so OrganizationSettingsPage falls back
  return coerceHeroFromMeta(row.metadata, {
    name: row.name,
    introTitle: row.introTitle,
    tagline: row.tagline,
    introDescription: row.introDescription,
  });
}
