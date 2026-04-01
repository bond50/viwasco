'use client';

import type { ProcessedSocialLink } from '@/lib/social-links';
import type { Platform } from '@/lib/schemas/shared/social';
import { PLATFORM_ICONS } from '@/lib/icons/platform-icons';
import { cn } from '@/lib/utils';
import styles from './social-links.module.css';

type SocialLinksInput = ProcessedSocialLink | { platform: Platform; url: string };

type SocialLinksProps = {
  links: SocialLinksInput[];
  /** Visual size affects both icon and container */
  size?: 'sm' | 'md' | 'lg';
  /** Used in aria-label: "John's x" */
  ownerName?: string;
  /** Extra classes for wrapper div */
  className?: string;
  /** Visual variant for different contexts */
  variant?: 'default' | 'minimal' | 'card-overlay' | 'topbar';
};

const ICON_SIZES: Record<NonNullable<SocialLinksProps['size']>, number> = {
  sm: 14,
  md: 18,
  lg: 22,
};

const SIZE_CLASS_MAP: Record<NonNullable<SocialLinksProps['size']>, string> = {
  sm: styles['social-link-sm'],
  md: styles['social-link-md'],
  lg: styles['social-link-lg'],
};

const VARIANT_CLASS_MAP: Record<NonNullable<SocialLinksProps['variant']>, string> = {
  default: styles['social-link-default'],
  minimal: styles['social-link-minimal'],
  'card-overlay': styles['social-link-card-overlay'],
  topbar: styles['social-link-topbar'],
};

export function SocialLinks({
  links,
  size = 'md',
  ownerName,
  className,
  variant = 'default',
}: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  const iconSize = ICON_SIZES[size];
  const sizeClass = SIZE_CLASS_MAP[size];
  const variantClass = VARIANT_CLASS_MAP[variant];

  return (
    <div className={cn(styles.root, 'd-flex align-items-center gap-2', className)}>
      {links.map((link, idx) => {
        const platform = link.platform as Platform;
        const Icon = PLATFORM_ICONS[platform];
        if (!Icon) return null;

        const label = ownerName ? `${ownerName}'s ${platform}` : platform;

        return (
          <a
            key={`${platform}-${idx}`}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
            className={cn(styles['social-link-base'], sizeClass, variantClass)}
          >
            <Icon size={iconSize} />
          </a>
        );
      })}
    </div>
  );
}
