// components/auth/back-button/BackNav.tsx
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from './back-button.module.css';

type CommonProps = {
  label: string;
  className?: string;
  variant?: 'text' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
  disabled?: boolean; // only applies to the button case
};

// Discriminated union: either href OR onClick
type BackNavProps =
  | (CommonProps & { href: string; onClick?: never })
  | (CommonProps & { href?: never; onClick: () => void });

export function BackNav({
  label,
  className = '',
  variant = 'text',
  size = 'md',
  'aria-label': ariaLabel,
  ...rest
}: BackNavProps) {
  const classes = cn(styles.button, styles[variant], styles[size], className);
  const computedAria = ariaLabel ?? `Go back to ${label}`;

  if ('href' in rest && rest.href) {
    // Link variant
    return (
      <Link href={rest.href} className={classes} aria-label={computedAria}>
        {label}
      </Link>
    );
  }

  // Button variant
  const { onClick, disabled } = rest as { onClick: () => void; disabled?: boolean };

  return (
    <button
      type="button"
      className={classes}
      aria-label={computedAria}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
