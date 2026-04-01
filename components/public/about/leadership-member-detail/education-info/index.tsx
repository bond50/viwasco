import type { TeamEducationItem } from '@/lib/data/public/about/getters';
import { HiAcademicCap } from 'react-icons/hi2';

import styles from '@/components/public/about/leadership-member-detail/career-section.module.css';

interface EducationSectionProps {
  educationItems: TeamEducationItem[];
  showEducation: boolean;
}

export function EducationSection({
  educationItems,
  showEducation,
}: EducationSectionProps) {
  const hasEducation = showEducation && educationItems.length > 0;
  if (!hasEducation) return null;

  return (
    <section className={styles.sectionCard}>
      {/* Section heading */}
      <div className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>
          <HiAcademicCap size={18} />
        </span>
        <span className={styles.sectionTitleText}>Education</span>
      </div>

      {/* Items */}
      <div className={styles.sectionBody}>
        {educationItems.map((edu, index) => {
          const key = edu.id || index;

          const hasDates = !!edu.startDate || !!edu.endDate || edu.isCurrent;

          const yearsLabel = hasDates
            ? `${edu.startDate ? new Date(edu.startDate).getFullYear() : ''}${
                edu.endDate
                  ? ` - ${new Date(edu.endDate).getFullYear()}`
                  : edu.isCurrent
                    ? ' - Present'
                    : ''
              }`
            : null;

          const levelLabel = edu.level ? edu.level.toLowerCase() : null;

          return (
            <article key={key} className={styles.sectionItem}>
              {edu.institution && (
                <div className={styles.itemHeading}>{edu.institution}</div>
              )}

              {edu.qualification && (
                <div className={styles.itemLine}>{edu.qualification}</div>
              )}

              {edu.field && (
                <div className={styles.itemLineMuted}>{edu.field}</div>
              )}

              {(levelLabel || yearsLabel) && (
                <div className={styles.itemMeta}>
                  {[levelLabel, yearsLabel].filter(Boolean).join(' · ')}
                </div>
              )}

              {edu.honor && (
                <div className={styles.itemAccent}>{edu.honor}</div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
