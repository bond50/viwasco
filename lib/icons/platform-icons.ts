import type { IconType } from 'react-icons';
import type { Platform } from '@/lib/schemas/shared/social';
// Simple Icons (CC0) for brands — no attribution required.
import { BiLogoLinkedin } from 'react-icons/bi';
import { SiFacebook, SiInstagram, SiThreads, SiTiktok, SiX } from 'react-icons/si';

export const PLATFORM_ICONS: Record<Platform, IconType> = {
  facebook: SiFacebook,
  x: SiX,
  instagram: SiInstagram,
  tiktok: SiTiktok,
  linkedin: BiLogoLinkedin,
  threads: SiThreads,
};
