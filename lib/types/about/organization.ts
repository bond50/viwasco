import { z } from 'zod';
import { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';
import {
  HERO_CONTENT_MODES,
  HERO_OVERLAY_STRENGTHS,
  HERO_TEXT_ALIGNS,
  HERO_TEXT_CHROMES,
  HERO_VARIANTS,
} from '@/lib/schemas/about/organization/hero';

export type UploadedImageJson = z.infer<typeof uploadedImageResponseSchema> | null | undefined;

export type HeroVariant = (typeof HERO_VARIANTS)[number];
export type HeroContentMode = (typeof HERO_CONTENT_MODES)[number];
export type HeroTextAlign = (typeof HERO_TEXT_ALIGNS)[number];
export type HeroTextChrome = (typeof HERO_TEXT_CHROMES)[number];
export type HeroOverlayStrength = (typeof HERO_OVERLAY_STRENGTHS)[number];

export type HeroDeviceState = {
  show: boolean;
  useVideo: boolean;
  textAlign: HeroTextAlign;
  textChrome: HeroTextChrome;
  showScrollCue: boolean;
  overlayStrength: HeroOverlayStrength;
};

export type HeroState = {
  enabled: boolean;
  variant: HeroVariant;
  contentMode: HeroContentMode;

  desktop: HeroDeviceState;
  mobile: HeroDeviceState;

  kicker: string | null;
  heading: string | null;
  subheading: string | null;

  videoSrc: string | null;
  mobileSrc: string | null;
  poster: string | null;
};

export type BasicMediaState = {
  name: string;
  tagline?: string | null;
  shortName?: string | null;
  logo?: UploadedImageJson;
  featuredImage?: UploadedImageJson;
};

export type IntroductionState = {
  introTitle?: string | null;
  introDescription?: string | null;
  bannerImage?: UploadedImageJson;
  introImage?: UploadedImageJson;
};

export type VisionMissionState = {
  vision?: string | null;
  mission?: string | null;
  visionIcon?: string | null;
  missionIcon?: string | null;
};

export type CoreValuesHeaderState = {
  coreValuesLeadText?: string | null;
  coreValuesImage?: UploadedImageJson;
};

export type ContactAddressState = {
  websiteUrl?: string | null;
  contactEmail?: string | null;
  contactRecipientEmails?: string[] | null;
  phone?: string | null;
  address?: string | null;
  footerAboutText?: string | null;
  customerPortalEnabled?: boolean;
  customerPortalLabel?: string | null;
  customerPortalUrl?: string | null;
  navigationVisibility?: NavigationVisibilityState | null;
  serviceCentres?: Array<{
    name: string;
    address: string;
  }> | null;
};

export type NavigationVisibilityState = {
  about?: boolean;
  services?: boolean;
  projects?: boolean;
  resources?: boolean;
  news?: boolean;
  tenders?: boolean;
  careers?: boolean;
  newsletters?: boolean;
  contact?: boolean;
};

export type LegalUtilityState = {
  regulatorName?: string | null;
  licenseNumber?: string | null;
  licenseExpiry?: Date | string | null;
  customerCareHotline?: string | null;
  whatsappNumber?: string | null;
};

export type SocialHoursState = {
  socialLinks?: Array<{ name: string; url: string; icon?: string | null }> | null;
  workingHours?: Array<{ days: string; hours: string }> | null;
};

export type FlagsMetadataState = {
  isFeatured?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  metadata?: string;
};

export type AdminAccessState = {
  emails: string[];
  bootstrap: boolean;
};

export type OrganizationSettingsData = {
  id: string;
  basic: BasicMediaState;
  adminAccess: AdminAccessState;
  introduction: IntroductionState;
  visionMission: VisionMissionState;
  coreValuesHeader: CoreValuesHeaderState;
  contact: ContactAddressState;
  legal: LegalUtilityState;
  socialHours: SocialHoursState;
  flags: FlagsMetadataState;

  // all hero-related stuff lives in here
  homepageHero: HeroState;
};
