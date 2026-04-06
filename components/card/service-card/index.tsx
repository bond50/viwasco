import Link from 'next/link';
import type { ReactNode } from 'react';

import { DynamicIcon } from '@/components/common/icons/DynamicIcon';

import styles from './ServiceCard.module.css';

type ServiceCardProps = {
  href: string;
  title: string;
  summary: string;
  meta?: string;
  iconKey?: string | null;
  iconFallback?: ReactNode;
  ctaLabel?: string;
  className?: string;
};

export default function ServiceCard({
  href,
  title,
  summary,
  meta,
  iconKey,
  iconFallback,
  ctaLabel = 'View details →',
  className,
}: ServiceCardProps) {
  return (
    <Link href={href} className={[styles.serviceCardLink, className].filter(Boolean).join(' ')}>
      <div className={styles.serviceCard}>
        {iconKey || iconFallback ? (
          <div className={styles.serviceCardIconWrap}>
            <DynamicIcon
              iconKey={iconKey ?? null}
              className={styles.serviceCardIcon}
              size={22}
              fallback={iconFallback}
            />
          </div>
        ) : null}

        {meta ? <div className={styles.serviceCardMeta}>{meta}</div> : null}

        <div className={styles.serviceTitle}>{title}</div>
        <p className={styles.serviceSummary}>{summary}</p>
        <span className={styles.serviceLink}>{ctaLabel}</span>
      </div>
    </Link>
  );
}
