import styles from '@/components/auth/forgot-password-link/forgot-password-link.module.css';
import Link from 'next/link';

interface ForgotPasswordLinkProps {
  label: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const ForgotPasswordLink = ({
  label,
  className = '',
  align = 'right',
}: ForgotPasswordLinkProps) => {
  return (
    <div className={`${styles.wrapper} ${styles[align]} ${className}`}>
      <Link href="/auth/reset" className={styles.link} aria-label="Reset password">
        {label}
      </Link>
    </div>
  );
};
