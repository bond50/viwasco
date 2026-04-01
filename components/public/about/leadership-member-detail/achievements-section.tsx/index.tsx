import type { TeamAchievementItem } from '@/lib/data/public/about/getters';
import { HiTrophy } from 'react-icons/hi2';
import styles from '@/components/public/about/leadership-member-detail/career-section.module.css';

interface AchievementsSectionProps {
  achievementItems: TeamAchievementItem[];
  showAchievements: boolean;
}

export function AchievementsSection({
  achievementItems,
  showAchievements,
}: AchievementsSectionProps) {
  const hasAchievements = showAchievements && achievementItems.length > 0;
  if (!hasAchievements) return null;

  return (
    <section className={styles.sectionCard}>
      {/* Section heading */}
      <div className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>
          <HiTrophy size={18} />
        </span>
        <span className={styles.sectionTitleText}>Key Achievements</span>
      </div>

      {/* Items */}
      <div className={styles.sectionBody}>
        {achievementItems.map((achievement, index) => {
          const key = achievement.id || index;

          const parts: string[] = [];
          if (achievement.issuer) parts.push(`Issued by: ${achievement.issuer}`);
          if (achievement.year) parts.push(`Year: ${achievement.year}`);

          return (
            <article
              key={key}
              className={styles.sectionItem}
            >
              {achievement.title && (
                <div className={styles.itemHeading}>
                  {achievement.title}
                </div>
              )}

              {parts.length > 0 && (
                <div className={styles.itemMeta}>{parts.join(' · ')}</div>
              )}

              {achievement.description && (
                <div className={styles.itemLineMuted}>
                  {achievement.description}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
