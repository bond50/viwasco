// components/public/about/leadership-member-detail/leadership-messages.tsx

import { RichContent } from '@/components/reusables/rich-text/HtmlContent';
import type { ActiveTeamMemberWithRelated } from '@/lib/data/public/about/getters';
import styles from './leadership-message.module.css';
import classes from '@/components/public/about/leadership-member-detail/leadership-member-detail.module.css';


type LeadershipMessageProps = {
  message: ActiveTeamMemberWithRelated['message'];
  leaderName?: string;
};

export function LeadershipMessage({ message, leaderName }: LeadershipMessageProps) {
  if (!message) return null;

  const heading =
    leaderName != null && leaderName.trim().length > 0
      ? `Message from ${leaderName}`
      : message.title || 'Leadership Message';

  // Only show the inner title when heading is the generic label
  const showInnerTitle = heading === 'Leadership Message' && !!message.title;

  const updatedAt = new Date(message.updatedAt);
  const updatedLabel = updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={classes.leaderShipWrapper}>
      <h3 className={classes.leaderShipHeading}>{heading}</h3>
      <figure className={styles.messageFigure}>
        {showInnerTitle && (
          <div className={styles.messageTitle}>{message.title}</div>
        )}

        <blockquote className={styles.messageQuote}>
          <span className={styles.messageQuoteText}>
            <RichContent html={message.body ?? ''} />
          </span>
        </blockquote>

        <div className={styles.messageMeta}>
          <span>
            Updated:{' '}
            <time dateTime={updatedAt.toISOString()}>{updatedLabel}</time>
          </span>
        </div>
      </figure>
    </div>
  );
}
