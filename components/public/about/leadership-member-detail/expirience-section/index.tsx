import type { TeamExperienceItem } from '@/lib/data/public/about/getters';
import { HiBriefcase } from 'react-icons/hi2';
import styles from '@/components/public/about/leadership-member-detail/career-section.module.css';

interface ExperienceSectionProps {
  experienceItems: TeamExperienceItem[];
  showExperience: boolean;
}

export function ExperienceSection({
  experienceItems,
  showExperience,
}: ExperienceSectionProps) {
  const hasExperience = showExperience && experienceItems.length > 0;
  if (!hasExperience) return null;

  return (
    <section className={styles.sectionCard}>
      {/* Section heading */}
      <div className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>
          <HiBriefcase size={18} />
        </span>
        <span className={styles.sectionTitleText}>Experience</span>
      </div>

      {/* Items */}
      <div className={styles.sectionBody}>
        {experienceItems.map((exp, index) => {
          const key = exp.id || index;

          const hasDates = !!exp.startDate || !!exp.endDate || exp.isCurrent;

          const yearsLabel = hasDates
            ? `${exp.startDate ? new Date(exp.startDate).getFullYear() : ''}${
                exp.endDate
                  ? ` - ${new Date(exp.endDate).getFullYear()}`
                  : exp.isCurrent
                    ? ' - Present'
                    : ''
              }`
            : null;

          return (
            <article key={key} className={styles.sectionItem}>
              {exp.organization && (
                <div className={styles.itemHeading}>{exp.organization}</div>
              )}

              {exp.role && (
                <div className={styles.itemLine}>{exp.role}</div>
              )}

              {yearsLabel && (
                <div className={styles.itemMeta}>{yearsLabel}</div>
              )}

              {exp.achievements && exp.achievements.length > 0 && (
                <div className={styles.itemLineMuted}>
                  <strong>Achievements:</strong>
                  <ul className={styles.achievementsList}>
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
