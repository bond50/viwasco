// components/auth/back-button/BackButton.tsx
import styles from './back-button.module.css';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  label: string;
  href: string;
  className?: string;
  variant?: 'text' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const BackButton = ({
  label,
  href,
  className = '',
  variant = 'text',
  size = 'md',
}: BackButtonProps) => {
  return (
    <Link
      href={href}
      className={cn(styles.button, styles[variant], styles[size], className)}
      aria-label={`Go back to ${label}`}
    >
      {label}
    </Link>
  );
};
