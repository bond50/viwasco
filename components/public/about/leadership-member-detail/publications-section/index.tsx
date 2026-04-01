import type { TeamPublicationItem } from '@/lib/data/public/about/getters';
import { HiDocumentText } from 'react-icons/hi2';
import styles from '@/components/public/about/leadership-member-detail/career-section.module.css';

interface PublicationsSectionProps {
  publicationItems: TeamPublicationItem[];
  showPublications: boolean;
}

export function PublicationsSection({
  publicationItems,
  showPublications,
}: PublicationsSectionProps) {
  const hasPublications = showPublications && publicationItems.length > 0;
  if (!hasPublications) return null;

  return (
    <div className="col-12">
      <section className={styles.sectionCard}>
        {/* Section heading */}
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>
            <HiDocumentText size={18} />
          </span>
          <span className={styles.sectionTitleText}>Publications</span>
        </div>

        {/* Items */}
        <div className={styles.sectionBody}>
          {publicationItems.map((pub, index) => {
            const key = pub.id || index;

            const metaParts: string[] = [];
            if (pub.year) metaParts.push(String(pub.year));

            return (
              <article
                key={key}
                className={styles.sectionItem}
              >
                {pub.title && (
                  <div className={styles.itemHeading}>{pub.title}</div>
                )}

                {metaParts.length > 0 && (
                  <div className={styles.itemMeta}>{metaParts.join(' · ')}</div>
                )}

                {pub.url && (
                  <div className={styles.itemAccent}>
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View publication
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
