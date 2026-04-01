'use client';

import { useState } from 'react';
import styles from '@/components/public/home/hero/hero-base.module.css';

type Props = {
  text: string;
  maxChars?: number;
  className?: string;
};

export function HeroSubtitle({ text, maxChars = 400, className }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  // If it's short, just render as-is
  if (text.length <= maxChars) {
    return <p className={`${styles.subtitle} ${className || ''}`}>{text}</p>;
  }

  // Avoid cutting mid-word
  const sliced = text.slice(0, maxChars);
  const short = sliced.replace(/\s+\S*$/, '');

  const toggleText = expanded ? 'Show less' : 'Read more';

  return (
    <p className={`${styles.subtitle} ${className || ''}`}>
      {expanded ? text : `${short}…`}{' '}
      <button
        type="button"
        className={styles.subtitleToggle}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={toggleText}
      >
        {toggleText}
      </button>
    </p>
  );
}