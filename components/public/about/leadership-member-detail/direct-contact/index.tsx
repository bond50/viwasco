import { HiEnvelope, HiPhone } from 'react-icons/hi2';
import styles from '@/components/public/about/leadership-member-detail/background-section.module.css';

interface DirectContactProps {
  showEmail: boolean;
  email?: string | null;
  showPhone: boolean;
  phone?: string | null;
}

export function DirectContact({
  showEmail,
  email,
  showPhone,
  phone,
}: DirectContactProps) {
  const showDirectContact = (showEmail && email) || (showPhone && phone);

  if (!showDirectContact) return null;

  return (
    <div className={styles.sectionContainer}>
      <h3 className={styles.sectionHeading}>Direct Contact</h3>

      <div className={styles.cardsGrid}>
        {showEmail && email && (
          <a
            href={`mailto:${email}`}
            className={styles.infoCardLink}
          >
            <div className={styles.infoCard}>
              <div className={styles.iconBox}>
                <HiEnvelope className={styles.icon} />
              </div>
              <div className={styles.cardTextWrapper}>
                <p className={styles.cardTitle}>Email</p>
                <p className={styles.cardBody}>{email}</p>
              </div>
            </div>
          </a>
        )}

        {showPhone && phone && (
          <a
            href={`tel:${phone}`}
            className={styles.infoCardLink}
          >
            <div className={styles.infoCard}>
              <div className={styles.iconBox}>
                <HiPhone className={styles.icon} />
              </div>
              <div className={styles.cardTextWrapper}>
                <p className={styles.cardTitle}>Phone</p>
                <p className={styles.cardBody}>{phone}</p>
              </div>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
