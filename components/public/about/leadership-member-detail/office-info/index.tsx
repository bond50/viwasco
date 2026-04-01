import { HiClock, HiMapPin, HiUser } from 'react-icons/hi2';
import styles from '@/components/public/about/leadership-member-detail/background-section.module.css';

interface OfficeInfoProps {
  officeLocation?: string | null;
  officeHours?: string | null;
  assistantContact?: string | null;
  showWorkingHours: boolean;
}

export function OfficeInfo({
  officeLocation,
  officeHours,
  assistantContact,
  showWorkingHours,
}: OfficeInfoProps) {
  const hasOfficeInfo =
    officeLocation || (showWorkingHours && officeHours) || assistantContact;

  if (!hasOfficeInfo) return null;

  return (
    <div className={styles.sectionContainer}>
      <h3 className={styles.sectionHeading}>
        Office Information
      </h3>

      <div className={styles.cardsGrid}>
        {officeLocation && (
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <HiMapPin className={styles.icon} />
            </div>
            <div className={styles.cardTextWrapper}>
              <p className={styles.cardTitle}>Location</p>
              <p className={styles.cardBody}>{officeLocation}</p>
            </div>
          </div>
        )}

        {showWorkingHours && officeHours && (
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <HiClock className={styles.icon} />
            </div>
            <div className={styles.cardTextWrapper}>
              <p className={styles.cardTitle}>Office Hours</p>
              <p className={styles.cardBody}>{officeHours}</p>
            </div>
          </div>
        )}

        {assistantContact && (
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <HiUser className={styles.icon} />
            </div>
            <div className={styles.cardTextWrapper}>
              <p className={styles.cardTitle}>Executive Assistant</p>
              <p className={styles.cardBody}>{assistantContact}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
