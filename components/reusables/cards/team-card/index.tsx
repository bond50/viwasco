// components/reusables/cards/team-card.tsx (path as you have it)
import Image from 'next/image';
import Link from 'next/link';

import styles from './team-card.module.css';
import { extractFirstParagraphAndTruncate } from '@/lib/truncate';
import { SocialLink } from '@/lib/schemas/shared/social';
import { IMAGE_SIZES } from '@/lib/image-size';
import { SocialLinks } from '@/components/reusables/social-links';

type TeamCardProps = {
  id: string;
  slug: string;
  /** Category that this leader belongs to (e.g. “Board”, “Executive Management”) */
  category?: { name: string; slug: string };
  /** Flag from DB to visually highlight key leaders */
  isFeatured?: boolean;
  name: string;
  position: string;
  bio: string | null;
  imageUrl: string;
  altText?: string;
  href?: string;
  priority?: boolean;
  blurDataURL?: string;
  imageWidth?: number;
  imageHeight?: number;
  socialLinks?: SocialLink[];
};

export const TeamCard = ({
  id,
  slug,
  category,
  isFeatured = false,
  name,
  position,
  bio,
  imageUrl,
  altText,
  imageWidth,
  imageHeight,
  href = '#',
  priority = false,
  blurDataURL,
  socialLinks = [],
}: TeamCardProps) => {
  const truncatedBio = bio ? extractFirstParagraphAndTruncate(bio, 150) : '';

  const fallbackWidth = IMAGE_SIZES.square.width;
  const fallbackHeight = IMAGE_SIZES.square.height;

  const finalWidth = imageWidth ?? fallbackWidth;
  const finalHeight = imageHeight ?? fallbackHeight;

  return (
    <article
      id={slug}
      data-member-id={id}
      className={`${styles['team-card']} ${isFeatured ? styles['team-card--featured'] : ''}`}
    >
      <div className={styles['team-image']}>
        <Image
          src={imageUrl}
          alt={altText || `${name}, ${position}`}
          width={finalWidth}
          height={finalHeight}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          quality={85}
          className="img-fluid"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {isFeatured && (
          <span className={styles['badge-featured']} aria-label="Featured leader">
            Featured
          </span>
        )}

        {/* Overlay socials, now via shared component */}
        {socialLinks.length > 0 && (
          <div className={styles['team-overlay']}>
            <SocialLinks
              links={socialLinks}
              size="sm"
              variant="card-overlay"
              ownerName={name}
              className={styles['team-social-links']}
            />
          </div>
        )}
      </div>

      <div className={styles['team-content']}>
        {category && (
          <div className={styles['team-meta']}>
            <span className={styles['team-category']}>{category.name}</span>
          </div>
        )}

        <h3 className={styles['team-name']}>
          <Link href={href} className="stretched-link" aria-label={`View ${name}'s profile`}>
            {name.toLowerCase()}
          </Link>
        </h3>

        <span className={styles['team-position']}>{position}</span>

        {truncatedBio && <p className={styles.bio}>{truncatedBio}</p>}
      </div>
    </article>
  );
};
