import { HiAcademicCap, HiLanguage, HiSparkles, HiUsers } from 'react-icons/hi2';
import styles from '@/components/public/about/leadership-member-detail/background-section.module.css';

interface ListsSectionProps {
  languages: string[];
  boardCommittees: string[];
  professionalAffiliations: string[];
  awards: string[];
  showLists: boolean;
}

export function ListsSection({
  languages,
  boardCommittees,
  professionalAffiliations,
  awards,
  showLists,
}: ListsSectionProps) {
  const hasLists =
    showLists &&
    (languages.length > 0 ||
      boardCommittees.length > 0 ||
      professionalAffiliations.length > 0 ||
      awards.length > 0);

  if (!hasLists) return null;

  return (
    <div className={styles.sectionContainer}>
      <h3 className={styles.sectionHeading}>Professional Background</h3>

      <div className={styles.cardsGrid}>
        {languages.length > 0 && (
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <HiLanguage className={styles.icon} />
            </div>
            <div className={styles.cardTextWrapper}>
              <p className={styles.cardTitle}>Languages</p>
              <ul className={styles.pillList}>
                {languages.map((lang) => (
                  <li key={lang} className={styles.pillItem}>
                    {lang}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {boardCommittees.length > 0 && (
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <HiUsers className={styles.icon} />
            </div>
            <div className={styles.cardTextWrapper}>
              <p className={styles.cardTitle}>Board Committees</p>
              <ul className={styles.pillList}>
                {boardCommittees.map((committee) => (
                  <li key={committee} className={styles.pillItem}>
                    {committee}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {professionalAffiliations.length > 0 && (
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <HiAcademicCap className={styles.icon} />
            </div>
            <div className={styles.cardTextWrapper}>
              <p className={styles.cardTitle}>Affiliations</p>
              <ul className={styles.pillList}>
                {professionalAffiliations.map((affiliation) => (
                  <li key={affiliation} className={styles.pillItem}>
                    {affiliation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {awards.length > 0 && (
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <HiSparkles className={styles.icon} />
            </div>
            <div className={styles.cardTextWrapper}>
              <p className={styles.cardTitle}>Awards</p>
              <ul className={styles.pillList}>
                {awards.map((award) => (
                  <li key={award} className={styles.pillItem}>
                    {award}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
