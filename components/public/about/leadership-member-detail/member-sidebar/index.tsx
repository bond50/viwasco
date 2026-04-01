import Image from 'next/image';
import { SocialLinks } from '@/components/reusables/social-links';
import type { ActiveTeamMemberWithRelated } from '@/lib/data/public/about/getters';

import styles from './member-sidebar.module.css';

interface MemberSidebarProps {
  member: ActiveTeamMemberWithRelated['member'];
  category: ActiveTeamMemberWithRelated['category'];
}

export function MemberSidebar({ member, category }: MemberSidebarProps) {
  return (
    <div className={styles.sidebarSticky}>
      <aside className={styles.profileCard}>
        <div className={styles.profileCardContent}>
          {/* Profile Image - Circular */}
          <div className={styles.profileImageWrapper}>
            <Image
              src={
                member.image?.main?.secure_url ||
                member.image?.main?.url ||
                '/images/placeholder-avatar.jpg'
              }
              alt={`${member.name}, ${member.position}`}
              width={120}
              height={120}
              className={styles.profileImage}
              priority
            />
            {member.isFeatured && (
              <span className={styles.featuredBadge}>Featured</span>
            )}
          </div>

          {/* Name and Position */}
          <h2 className={styles.profileName}>{member.name}</h2>
          <h3 className={styles.profilePosition}>{member.position}</h3>

          {/* Category Badge */}
          <div className={styles.categoryBadge}>{category.name}</div>

          {/* Expertise Area */}
          {member.expertiseArea && (
            <p className={styles.expertiseArea}>
              <strong>Expertise:</strong> {member.expertiseArea}
            </p>
          )}

          {/* Social Links */}
          {member.showSocialLinks && (member.socialLinks?.length ?? 0) > 0 && (
            <div className={styles.socialLinksWrapper}>
              <SocialLinks
                links={member.socialLinks}
                size="md"
                variant="minimal"
                ownerName={member.name}
                className={styles.profileSocialLinks}
              />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
