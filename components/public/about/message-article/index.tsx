import { RichContent } from '@/components/reusables/rich-text/HtmlContent';
import styles from './message-article.module.css';

type MessageAuthorVm = {
  name: string;
  position?: string | null;
  slug: string;
};

type MessageVm = {
  title: string;
  body: string;
  excerpt?: string | null;
  updatedAt?: Date | string;
  authorTeam?: MessageAuthorVm;
};

interface MessageArticleProps {
  msg: MessageVm | null;
}

export function MessageArticle({ msg }: MessageArticleProps) {
  if (!msg) {
    return (
      <article className={styles.emptyCard}>
        <h1 className={styles.emptyTitle}>Leadership message coming soon</h1>
        <p className={styles.emptyText}>
          Our leadership team is preparing a message that reflects our vision and
          commitment to the people we serve. Please check back again later.
        </p>
      </article>
    );
  }

  const { title, body, excerpt, updatedAt, authorTeam } = msg;

  const dateLabel =
    updatedAt != null
      ? new Date(updatedAt).toLocaleDateString('en-KE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : null;

  return (
    <article className={styles.articleCard}>
      <header className={styles.articleHeader}>
        <p className={styles.kicker}>From the Leadership</p>
        <h1 className={styles.articleTitle}>{title}</h1>

        <div className={styles.articleMeta}>
          {authorTeam && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>By</span>{' '}
              <span className={styles.metaValue}>{authorTeam.name}</span>
              {authorTeam.position && (
                <span className={styles.metaPosition}>
                  {' '}
                  — {authorTeam.position}
                </span>
              )}
            </span>
          )}

          {dateLabel && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Updated</span>{' '}
              <span className={styles.metaValue}>{dateLabel}</span>
            </span>
          )}
        </div>

        {excerpt && (
          <p className={styles.excerpt}>
            {excerpt}
          </p>
        )}
      </header>

      <div className={styles.articleBody}>
        <RichContent
          html={body}
          imageSizes="(max-width: 768px) 100vw,
                     (max-width: 1200px) 80vw,
                     900px"
        />
      </div>
    </article>
  );
}
