import Link from 'next/link';
import styles from '@/components/public/about/message-article/message-article.module.css';

type MessageAuthorVm = {
  name: string;
  position?: string | null;
  slug: string;
};

interface MessageAuthorCardProps {
  author?: MessageAuthorVm;
}

export function MessageAuthorCard({ author }: MessageAuthorCardProps) {
  if (!author) {
    return (
      <aside className={styles.authorCard}>
        <h2 className={styles.authorHeading}>Leadership</h2>
        <p className={styles.authorText}>
          Our leadership team provides direction, accountability, and a clear
          vision for service delivery. Explore the full leadership roster to
          learn more about the people guiding this institution.
        </p>
        <Link
          href="/about/leadership/team"
          className={styles.authorLinkButton}
        >
          View Leadership Team
        </Link>
      </aside>
    );
  }

  return (
    <aside className={styles.authorCard}>
      <h2 className={styles.authorHeading}>Message Author</h2>

      <div className={styles.authorBody}>
        <div className={styles.authorAvatar}>
          <span className={styles.authorInitials}>
            {author.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </span>
        </div>

        <div className={styles.authorTextBlock}>
          <p className={styles.authorName}>{author.name}</p>
          {author.position && (
            <p className={styles.authorPosition}>{author.position}</p>
          )}
        </div>
      </div>

      <p className={styles.authorTextMuted}>
        This message reflects the priorities and strategic direction articulated
        by our leadership team.
      </p>

      <Link
        href={`/about/leadership/team/${author.slug}`}
        className={styles.authorLinkButton}
      >
        View full profile
      </Link>
    </aside>
  );
}
