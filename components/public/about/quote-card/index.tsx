import Image from 'next/image';
import Link from 'next/link';
import { FiMessageCircle, FiStar } from 'react-icons/fi';
import { BiSolidQuoteRight } from 'react-icons/bi';
import styles from './quote-card.module.css';

type QuoteCardVariant = 'testimonial' | 'message';

export interface QuoteCardProps {
  variant: QuoteCardVariant;
  /** Main text / quote body */
  message: string;
  /** Person’s name */
  name: string;
  /** Person’s role, title, or descriptor */
  role?: string | null;
  /** Optional “type” label e.g. "Leadership Message" */
  label?: string;
  /** Optional avatar image URL */
  avatarUrl?: string | null;
  /** Optional href to view more details */
  href?: string;
  /** Optional date label (for messages) */
  dateLabel?: string;
}

export function QuoteCard({
  variant,
  message,
  name,
  role,
  label,
  avatarUrl,
  href,
  dateLabel,
}: QuoteCardProps) {
  const initials =
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

  const isTestimonial = variant === 'testimonial';

  const content = (
    <article className={styles.quoteCard}>
      {/* Top badges row */}
      {(label || dateLabel) && (
        <div className={styles.badgeRow}>
          {label && (
            <span className={styles.labelBadge}>
              <FiMessageCircle className={styles.badgeIcon} aria-hidden="true" />
              <span>{label}</span>
            </span>
          )}
          {dateLabel && <span className={styles.dateBadge}>{dateLabel}</span>}
        </div>
      )}

      {/* Header: avatar + name + rating (for testimonials) */}
      <header className={styles.header}>
        <div className={styles.avatarWrapper}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={80}
              height={80}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarFallback} aria-hidden="true">
              <span className={styles.avatarInitials}>{initials}</span>
            </div>
          )}
        </div>

        <div className={styles.headerText}>
          <h5 className={styles.name}>{name}</h5>
          {role && <span className={styles.role}>{role}</span>}

          {isTestimonial && (
            <div className={styles.ratingRow} aria-label="5 star rating">
              {Array.from({ length: 5 }).map((_, idx) => (
                <FiStar key={idx} className={styles.starIcon} aria-hidden="true" />
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      <div className={styles.body}>
        <BiSolidQuoteRight className={styles.bodyQuoteIcon} aria-hidden="true" />
        <p className={styles.message}>{message}</p>
      </div>

      {/* Footer decorative icon only */}
      <footer className={styles.footer}>
        <div className={styles.footerAccent} aria-hidden="true" />
      </footer>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className={styles.cardLink}>
        {content}
      </Link>
    );
  }

  return content;
}
