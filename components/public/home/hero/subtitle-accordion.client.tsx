'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/components/public/home/hero/hero-base.module.css';

type Props = {
  text: string;
  maxChars?: number;
  className?: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function HeroSubtitle({
  text,
  maxChars = 180,
  className,
  primaryHref = '/services',
  primaryLabel = 'Our Services',
}: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const actions = (
    <div className={styles.subtitleActions}>
      <Link href={primaryHref} className={styles.heroPrimaryCta}>
        {primaryLabel}
      </Link>

      {text.length > maxChars ? (
        <button
          type="button"
          className={styles.subtitleToggle}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Show less' : 'Read more'}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}
    </div>
  );

  // If it's short, just render as-is
  if (text.length <= maxChars) {
    return (
      <div className={styles.subtitleBlock}>
        <p className={`${styles.subtitle} ${className || ''}`}>{text}</p>
        {actions}
      </div>
    );
  }

  // Avoid cutting mid-word
  const sliced = text.slice(0, maxChars);
  const short = sliced.replace(/\s+\S*$/, '');

  return (
    <div className={styles.subtitleBlock}>
      <p className={`${styles.subtitle} ${className || ''}`}>{expanded ? text : `${short}…`}</p>
      {actions}
    </div>
  );
}
